export class LoginModel {
  username: string;
  password: string;
  token: string;
}

export interface SocialLoginModel {
  id: string;
  name: string;
  token: string;
  image: string;
  id_token: string;
  provider: string;
  firstname: string;
  password: string;
  lastname: string;
  email: string;
  username: string;
  job: string;
  device: DeviceInfo;
}

export interface DeviceInfo {
  deviceType: DeviceType;
  deviceName: string;
  deviceLocation: string;
  iPAddress: string;
  deviceMAC: string;
}

enum DeviceType {
  Tablet = 0,
  Mobile = 1,
  Desktop = 2,
}
