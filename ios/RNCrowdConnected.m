//
//  RNCrowdConnected.m
//  RNCrowdConnected
//
//  Created by Andy West on 01/07/2022.
//

#import "React/RCTBridgeModule.h"
#import "React/RCTEventEmitter.h"

@interface RCT_EXTERN_MODULE(RNCrowdConnected, RCTEventEmitter)

RCT_EXTERN_METHOD(start:(NSString)key token:(NSString)token secret:(NSString)secret)
RCT_EXTERN_METHOD(startNavigation)
RCT_EXTERN_METHOD(stopNavigation)
RCT_EXTERN_METHOD(setAlias:(NSString)key withValue:(NSString)value)

@end
