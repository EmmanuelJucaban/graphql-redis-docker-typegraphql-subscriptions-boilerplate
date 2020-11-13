import { registerEnumType } from 'type-graphql';

export enum PreferenceType {
  Web = 'Web',
  ScanDevice = 'Scan Device',
}

export enum StateType {
  Setup = 'Setup',
  Ready = 'Ready',
}

export enum BaseCollectionType {
  Account = 'Account',
  Crew = 'Crew',
  Employee = 'Employee',
  Field = 'Field',
  Job = 'Job',
  JobGroup = 'JobGroup',
  Ranch = 'Ranch',
  User = 'User',
}

export enum WeekDays {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday',
}

export enum DeleteType {
  Saved = 'Saved',
  Deleted = 'Deleted',
  Archived = 'Archived',
}

export enum RoleType {
  Admin = 'Admin',
  Manager = 'Manager',
  InputUser = 'InputUser',
  SetupUser = 'SetupUser',
  FieldUser = 'FieldUser',
  Worker = 'Worker',
}

export enum LogType {
  StartOfDay = 'StartOfDay',
  TimeIn = 'TimeIn',
  TimeOut = 'TimeOut',
  Break = 'Break',
  Lunch = 'Lunch',
  Exercise = 'Exercise',
  Harvest = 'Harvest',
  PieceOut = 'PieceOut',
  EndOfDay = 'EndOfDay',
  Import = 'Import',
}

export enum StatusType {
  Active = 'Active',
  Completed = 'Completed',
  Approved = 'Approved',
}

// created, verified, distributed, computed, exported
// export type TPaymentTypes = ''
export enum PaymentTypes {
  Bonus = 'Bonus',
  DataTracking = 'DataTracking',
  DeterminedByJobEnd = 'DeterminedByJobEnd',
  DeterminedByPool = 'DeterminedByPool',
  ExtraWages = 'ExtraWages',
  IdleTime = 'IdleTime',
  NonLabor = 'NonLabor',
  PayrollConcept = 'PayrollConcept',
  Piece = 'Piece',
  PieceAsTime = 'PieceAsTime',
  Premium = 'Premium',
  Time = 'Time',
  TimeAndAllPieces = 'TimeAndAllPieces',
  TimeAndPiece = 'TimeAndPiece',
  TimeAndDeterminedByJobEnd = 'TimeAndDeterminedByJobEnd',
  NotFound = 'NotFound',
}

export enum DayStart {
  h00 = '00', h01 = '01', h02 = '02', h03 = '03', h04 = '04', h05 = '05',
  h06 = '06', h07 = '07', h08 = '08', h09 = '09', h10 = '10', h11 = '11',
  h12 = '12', h13 = '13', h14 = '14', h15 = '15', h16 = '16', h17 = '17',
  h18 = '18', h19 = '19', h20 = '20', h21 = '21', h22 = '22', h23 = '23',
}

export enum WeekStart {
  w01 = '01', w02 = '02', w03 = '03', w04 = '04', w05 = '05', w06 = '06',
  w07 = '07', w08 = '08', w09 = '09', w10 = '10', w11 = '11', w12 = '12',
  w13 = '13', w14 = '14', w15 = '15', w16 = '16', w17 = '17', w18 = '18',
  w19 = '19', w20 = '20', w21 = '21', w22 = '22', w23 = '23', w24 = '24',
  w25 = '25', w26 = '26', w27 = '27', w28 = '28', w29 = '29', w30 = '30',
  w31 = '31', w32 = '32', w33 = '33', w34 = '34', w35 = '35', w36 = '36',
  w37 = '37', w38 = '38', w39 = '39', w40 = '40', w41 = '41', w42 = '42',
  w43 = '43', w44 = '44', w45 = '45', w46 = '46', w47 = '47', w48 = '48',
  w49 = '49', w50 = '50', w51 = '51', w52 = '52', w53 = '53',
}

registerEnumType(StateType, { name: 'StateType' });
registerEnumType(WeekDays, { name: 'WeekDays' });
registerEnumType(DeleteType, { name: 'DeleteType' });
registerEnumType(RoleType, { name: 'RoleType' });
registerEnumType(LogType, { name: 'LogType' });
registerEnumType(StatusType, { name: 'StatusType' });
registerEnumType(PaymentTypes, { name: 'PaymentTypes' });
registerEnumType(DayStart, { name: 'DayStart' });
registerEnumType(WeekStart, { name: 'WeekStart' });
registerEnumType(BaseCollectionType, { name: 'BaseCollectionType' });
registerEnumType(PreferenceType, { name: 'PreferenceType' });
