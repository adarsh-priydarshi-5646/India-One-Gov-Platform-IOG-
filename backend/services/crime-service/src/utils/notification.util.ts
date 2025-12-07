import axios from 'axios';
import { logger } from './logger';

interface FIRNotificationPayload {
  type: 'FIR';
  firId: string;
  firNumber: string;
  crimeType: string;
  description: string;
  location: {
    state: string;
    district: string;
    policeStation: string;
    address: string;
    lat?: number;
    lng?: number;
  };
  priority: string;
  reporterName: string;
  reporterContact: string;
  incidentDate: string;
  incidentTime?: string;
  isAnonymous: boolean;
}

const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3006';

/**
 * Send FIR notification to police station and authorities
 */
export async function sendFIRNotifications(payload: FIRNotificationPayload): Promise<void> {
  try {
    logger.info(`Sending FIR notifications for ${payload.firNumber}`, {
      firId: payload.firId,
      policeStation: payload.location.policeStation,
      priority: payload.priority,
    });

    // Notify local police station (highest priority)
    await notifyPoliceStation(payload);

    // Notify district police headquarters
    await notifyDistrictPolice(payload);

    // For critical crimes, notify state police
    if (payload.priority === 'CRITICAL' || payload.priority === 'HIGH') {
      await notifyStatePolice(payload);
    }

    // For specific crime types, notify specialized units
    await notifySpecializedUnits(payload);

    logger.info(`FIR notifications sent successfully for ${payload.firNumber}`);
  } catch (error) {
    logger.error('Failed to send FIR notifications', error);
    // Don't throw - notification failure shouldn't block FIR registration
  }
}

/**
 * Notify local police station
 */
async function notifyPoliceStation(payload: FIRNotificationPayload): Promise<void> {
  try {
    await axios.post(`${NOTIFICATION_SERVICE_URL}/api/notifications/police-station`, {
      recipient: {
        type: 'POLICE_STATION',
        location: {
          state: payload.location.state,
          district: payload.location.district,
          policeStation: payload.location.policeStation,
        },
      },
      payload: {
        ...payload,
        timestamp: new Date().toISOString(),
        urgency: payload.priority === 'CRITICAL' ? 'IMMEDIATE' : 'HIGH',
      },
      channels: ['SMS', 'PUSH', 'EMAIL'], // All channels for police
      priority: 'HIGH',
    }, {
      timeout: 5000,
    });

    logger.info(`Police station notified for FIR ${payload.firNumber}`, {
      policeStation: payload.location.policeStation,
    });
  } catch (error: any) {
    logger.error('Failed to notify police station', {
      error: error.message,
      firId: payload.firId,
    });
  }
}

/**
 * Notify district police headquarters
 */
async function notifyDistrictPolice(payload: FIRNotificationPayload): Promise<void> {
  try {
    await axios.post(`${NOTIFICATION_SERVICE_URL}/api/notifications/district-police`, {
      recipient: {
        type: 'DISTRICT_POLICE',
        location: {
          state: payload.location.state,
          district: payload.location.district,
        },
      },
      payload: {
        ...payload,
        timestamp: new Date().toISOString(),
      },
      channels: ['EMAIL', 'PUSH'],
      priority: payload.priority === 'CRITICAL' ? 'HIGH' : 'NORMAL',
    }, {
      timeout: 5000,
    });

    logger.info(`District police notified for FIR ${payload.firNumber}`);
  } catch (error: any) {
    logger.error('Failed to notify district police', {
      error: error.message,
      firId: payload.firId,
    });
  }
}

/**
 * Notify state police for critical crimes
 */
async function notifyStatePolice(payload: FIRNotificationPayload): Promise<void> {
  try {
    await axios.post(`${NOTIFICATION_SERVICE_URL}/api/notifications/state-police`, {
      recipient: {
        type: 'STATE_POLICE',
        location: {
          state: payload.location.state,
        },
      },
      payload: {
        ...payload,
        timestamp: new Date().toISOString(),
      },
      channels: ['EMAIL', 'PUSH'],
      priority: 'HIGH',
    }, {
      timeout: 5000,
    });

    logger.info(`State police notified for FIR ${payload.firNumber}`);
  } catch (error: any) {
    logger.error('Failed to notify state police', {
      error: error.message,
      firId: payload.firId,
    });
  }
}

/**
 * Notify specialized units based on crime type
 */
async function notifySpecializedUnits(payload: FIRNotificationPayload): Promise<void> {
  const specializedUnits: Record<string, string> = {
    'CYBERCRIME': 'CYBER_CELL',
    'RAPE': 'WOMEN_CELL',
    'DOMESTIC_VIOLENCE': 'WOMEN_CELL',
    'HUMAN_TRAFFICKING': 'ANTI_TRAFFICKING_UNIT',
    'TERRORISM': 'ANTI_TERRORISM_SQUAD',
    'DRUG_TRAFFICKING': 'NARCOTICS_BUREAU',
    'ECONOMIC_OFFENSE': 'ECONOMIC_OFFENSES_WING',
  };

  const unitType = specializedUnits[payload.crimeType];
  
  if (!unitType) {
    return; // No specialized unit needed
  }

  try {
    await axios.post(`${NOTIFICATION_SERVICE_URL}/api/notifications/specialized-unit`, {
      recipient: {
        type: unitType,
        location: {
          state: payload.location.state,
          district: payload.location.district,
        },
      },
      payload: {
        ...payload,
        timestamp: new Date().toISOString(),
      },
      channels: ['EMAIL', 'PUSH', 'SMS'],
      priority: 'HIGH',
    }, {
      timeout: 5000,
    });

    logger.info(`Specialized unit ${unitType} notified for FIR ${payload.firNumber}`);
  } catch (error: any) {
    logger.error(`Failed to notify specialized unit ${unitType}`, {
      error: error.message,
      firId: payload.firId,
    });
  }
}

/**
 * Send status update notification to reporter
 */
export async function sendFIRStatusUpdate(
  firId: string,
  firNumber: string,
  reporterId: string,
  oldStatus: string,
  newStatus: string,
  remarks?: string
): Promise<void> {
  try {
    await axios.post(`${NOTIFICATION_SERVICE_URL}/api/notifications/fir-status-update`, {
      firId,
      firNumber,
      reporterId,
      oldStatus,
      newStatus,
      remarks,
      timestamp: new Date().toISOString(),
      channels: ['SMS', 'PUSH', 'EMAIL'],
    }, {
      timeout: 5000,
    });

    logger.info(`FIR status update notification sent for ${firNumber}`);
  } catch (error: any) {
    logger.error('Failed to send FIR status update notification', {
      error: error.message,
      firId,
    });
  }
}
