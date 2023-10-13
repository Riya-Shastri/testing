import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class IpServiceService {
  ipAddress: string;
  constructor(private http: HttpClient) {}

  public getIPAddress(): string {
    let ipAddressLocal: string;
    const pc = new RTCPeerConnection({ iceServers: [] });
    pc.createDataChannel("");
    pc.createOffer().then((offer) => pc.setLocalDescription(offer));
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        const ipRegex =
          /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/;

        if (ipRegex.exec(event.candidate.candidate) == null) {
          let arrayLocalIp = event.candidate.candidate.split(" ");
          arrayLocalIp.forEach((item) => {
            if (item.toLowerCase().includes("local")) {
              let intermediate = item.split(".");
              this.ipAddress = intermediate[0];

              return this.ipAddress;
            }
          });
        } else {
          const ipAddress = ipRegex.exec(event.candidate.candidate)[1];
          this.ipAddress = ipAddress;

          return this.ipAddress;
        }
      }
    };

    return this.ipAddress;
  }
}
