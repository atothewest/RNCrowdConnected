//
//  RNCrowdConnected.swift
//  FarnboroughInternationalAirshow2020
//
//  Created by Andy West on 01/07/2022.
//  Copyright © 2022 Kyan. All rights reserved.
//

import Foundation
import CrowdConnectedGeo
import CrowdConnectedIPS
import CrowdConnectedCore
import os.log

@objc(RNCrowdConnected)
class RNCrowdConnected: RCTEventEmitter, CrowdConnectedDelegate {
  @objc
  func start(_ appKey: NSString, token: NSString, secret: NSString) {
    os_log("Initializing CrowdConnected SDK")

    CrowdConnectedGeo.activate()
    CrowdConnectedIPS.activate()
    CrowdConnected.shared.start(appKey: appKey as String, token: token as String, secret: secret as String) { deviceId, error in
      // If the completion returns a non-nil Error, then the SDK has failed to start and is not functional.
      // Otherwise, the completion will provide a valid device ID and a nil Error
      guard let id = deviceId else {
        if (error != nil) {
          os_log("CrowdConnected error is %@", type: .error, error ?? "")
        }
        return
      }

      os_log("CrowdConnected SDK initialized successfully, device ID: %@", id)
    }
    
    CrowdConnected.shared.delegate = self
    self.sendEvent(withName: "onReady", body: [])
  }
  
  @objc
  func startNavigation() {
    os_log("CrowdConnected start navigation")
    CrowdConnected.shared.startNavigation()
  }
  
  @objc
  func stopNavigation() {
    os_log("CrowdConnected stop navigation")
    CrowdConnected.shared.stopNavigation()
  }

  @objc
  func setAlias(_ key: NSString, withValue value: NSString) {
    os_log("CrowdConnected set alias key: %@, value: %@", key, value)
    CrowdConnected.shared.setAlias(key: key as String, value: value as String)
  }
  
  func didUpdateLocation(_ locations: [Location]) {
    self.sendEvent(
      withName: "onLocationUpdated",
      body: [
        "latitude": locations[0].latitude,
        "longitude": locations[0].longitude
      ]
    )
  }
  
  override func supportedEvents() -> [String]! {
    return ["onReady", "onLocationUpdated"]
  }
  
  override func constantsToExport() -> [AnyHashable : Any]! {
    return ["locations": []]
  }
  
  override static func requiresMainQueueSetup() -> Bool {
    return false
  }
}
