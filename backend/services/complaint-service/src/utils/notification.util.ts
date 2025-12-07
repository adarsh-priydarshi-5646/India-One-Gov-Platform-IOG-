import axios from 'axios';
import { logger } from './logger';

interface NotificationPayload {
  type: 'COMPLAINT' | 'FIR' | 'CORRUPTION' | 'POLITICIAN_COMPLAINT';
  complaintId: string;
  complaintNumber: string;
  category: string;
  subCategory?: string;
  title: string;
  description: string;
  location: {
    state: string;
    district: string;
    address: string;
    lat?: number;
    lng?: number;
  };
  urgencyLevel: string;
  citizenId: string;
  citizenName: string;
  citizenContact: string;
  // For employee/politician complaints
  targetPerson?: {
    name: string;
    designation?: string;
    department?: string;
    position?: string;
  };
  incidentDate?: string;
  estimatedLoss?: number;
}

interface NotificationRecipient {
  type: 'POLICE_STATION' | 'DISTRICT_ADMIN' | 'STATE_ADMIN' | 'ANTI_CORRUPTION' | 'ELECTION_COMMISSION';
  location?: {
    state: string;
    district: string;
    policeStation?: string;
  };
}

const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3006';

/**
 * Send notification to relevant authorities based on complaint type and location
 */
export async function sendComplaintNotifications(payload: NotificationPayload): Promise<void> {
  try {
    const recipients = determineRecipients(payload);
    
    logger.info(`Sending notifications for ${payload.type} to ${recipients.length} recipients`, {
      complaintId: payload.complaintId,
      recipients: recipients.map(r => r.type),
    });

    // Send notifications to all recipients
    const notificationPromises = recipients.map(recipient => 
      sendNotification(payload, recipient)
    );

    await Promise.allSettled(notificationPromises);
    
    logger.info(`Notifications sent successfully for complaint ${payload.complaintId}`);
  } catch (error) {
    logger.error('Failed to send notifications', error);
    // Don't throw - notification failure shouldn't block complaint creation
  }
}

/**
 * Determine which authorities should be notified based on complaint type
 */
function determineRecipients(payload: NotificationPayload): NotificationRecipient[] {
  const recipients: NotificationRecipient[] = [];

  // Always notify district admin
  recipients.push({
    type: 'DISTRICT_ADMIN',
    location: {
      state: payload.location.state,
      district: payload.location.district,
    },
  });

  // For high urgency, also notify state admin
  if (payload.urgencyLevel === 'HIGH' || payload.urgencyLevel === 'URGENT') {
    recipients.push({
      type: 'STATE_ADMIN',
      location: {
        state: payload.location.state,
        district: payload.location.district,
      },
    });
  }

  // For corruption/bribery complaints
  if (
    payload.category === 'Bribery/Corruption' ||
    payload.category === 'Government Employee Misconduct' ||
    payload.category === 'Police Misconduct'
  ) {
    recipients.push({
      type: 'ANTI_CORRUPTION',
      location: {
        state: payload.location.state,
        district: payload.location.district,
      },
    });
  }

  // For politician complaints
  if (
    payload.category === 'Politician Misconduct' ||
    payload.category === 'Misuse of Funds' ||
    payload.category === 'Unfulfilled Promises'
  ) {
    recipients.push({
      type: 'ELECTION_COMMISSION',
      location: {
        state: payload.location.state,
        district: payload.location.district,
      },
    });
  }

  // For police-related complaints
  if (payload.category === 'Police Misconduct') {
    recipients.push({
      type: 'STATE_ADMIN', // Higher authority for police complaints
      location: {
        state: payload.location.state,
        district: payload.location.district,
      },
    });
  }

  return recipients;
}

/**
 * Send notification to a specific recipient
 */
async function sendNotification(
  payload: NotificationPayload,
  recipient: NotificationRecipient
): Promise<void> {
  try {
    const notificationData = {
      recipient,
      payload: {
        ...payload,
        timestamp: new Date().toISOString(),
      },
      channels: ['EMAIL', 'SMS', 'PUSH'], // Send via all channels
      priority: payload.urgencyLevel === 'URGENT' ? 'HIGH' : 'NORMAL',
    };

    await axios.post(`${NOTIFICATION_SERVICE_URL}/api/notifications/send`, notificationData, {
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    logger.info(`Notification sent to ${recipient.type}`, {
      complaintId: payload.complaintId,
      recipientType: recipient.type,
    });
  } catch (error: any) {
    logger.error(`Failed to send notification to ${recipient.type}`, {
      error: error.message,
      complaintId: payload.complaintId,
    });
    // Don't throw - continue with other notifications
  }
}

/**
 * Send FIR notification to police station based on location
 */
export async function sendFIRNotifications(payload: NotificationPayload): Promise<void> {
  try {
    const recipients: NotificationRecipient[] = [
      // Notify local police station
      {
        type: 'POLICE_STATION',
        location: {
          state: payload.location.state,
          district: payload.location.district,
        },
      },
      // Notify district police admin
      {
        type: 'DISTRICT_ADMIN',
        location: {
          state: payload.location.state,
          district: payload.location.district,
        },
      },
    ];

    // For critical crimes, notify state level
    if (payload.urgencyLevel === 'CRITICAL' || payload.urgencyLevel === 'URGENT') {
      recipients.push({
        type: 'STATE_ADMIN',
        location: {
          state: payload.location.state,
          district: payload.location.district,
        },
      });
    }

    logger.info(`Sending FIR notifications to ${recipients.length} recipients`, {
      firId: payload.complaintId,
      recipients: recipients.map(r => r.type),
    });

    const notificationPromises = recipients.map(recipient => 
      sendNotification(payload, recipient)
    );

    await Promise.allSettled(notificationPromises);
    
    logger.info(`FIR notifications sent successfully for ${payload.complaintId}`);
  } catch (error) {
    logger.error('Failed to send FIR notifications', error);
  }
}

/**
 * Send real-time update notification when complaint status changes
 */
export async function sendStatusUpdateNotification(
  complaintId: string,
  complaintNumber: string,
  citizenId: string,
  oldStatus: string,
  newStatus: string,
  remarks?: string
): Promise<void> {
  try {
    await axios.post(`${NOTIFICATION_SERVICE_URL}/api/notifications/status-update`, {
      complaintId,
      complaintNumber,
      citizenId,
      oldStatus,
      newStatus,
      remarks,
      timestamp: new Date().toISOString(),
      channels: ['EMAIL', 'SMS', 'PUSH'],
    }, {
      timeout: 5000,
    });

    logger.info(`Status update notification sent for complaint ${complaintId}`);
  } catch (error: any) {
    logger.error('Failed to send status update notification', {
      error: error.message,
      complaintId,
    });
  }
}

/**
 * Get police station details based on location
 * This would typically query a database of police stations
 */
async function getPoliceStationByLocation(
  state: string,
  district: string,
  lat?: number,
  lng?: number
): Promise<string | null> {
  // TODO: Implement actual police station lookup
  // For now, return a placeholder
  return `${district} Police Station`;
}
