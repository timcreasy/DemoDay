#import "BeaconBridge.h"
#import "RCTBridge.h"
#import "RCTEventDispatcher.h"

@interface BeaconBridge()
@property PHYEddystoneManager *phyManager;
@end

@implementation BeaconBridge
@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(initPhyManagerWithApiKey:(NSString *)apiKey)
{
  _phyManager = [[PHYEddystoneManager alloc] initWithApiKey:apiKey];
  _phyManager.delegate = self;
}

RCT_EXPORT_METHOD(startScanningForBeacons)
{
  [_phyManager startScanningForBeaconsWithMetadata];
}

RCT_EXPORT_METHOD(stopScanningForBeacons)
{
  [_phyManager stopScanningForBeacons];
}

- (void)phyManager:(PHYEddystoneManager *)manager didScanBeacons:(NSArray *)beacons {
  
  NSMutableArray* beaconsArray = [NSMutableArray array];
  for (int i = 0; i < beacons.count; i++)
  {
    PHYEddystoneBeacon *beacon = beacons[i];
    id null = [NSNull null];
    NSDictionary *dict =  [NSDictionary dictionaryWithObjectsAndKeys:
                           (beacon.scanUrl ?: null),@"scanUrl",
                           (beacon.txPowerLevel ?: null),@"txPowerLevel",
                           (beacon.rssi ?: null),@"rssi",
                           (beacon.title ?: null),@"title",
                           (beacon.hasMetadata ?: null),@"hasMetadata",
                           (beacon.destinationUrl ?: null),@"destinationUrl",
                           (beacon.faviconUrl ?: null),@"faviconUrl",
                           (beacon.desc ?: null),@"desc",
                           (beacon.jsonLd ?: null),@"jsonLd",
                           nil];
    [beaconsArray addObject:dict];
  }
  
  NSError *error = nil;
  NSData *jsonData = [NSJSONSerialization dataWithJSONObject:beaconsArray
                                                     options:NSJSONWritingPrettyPrinted
                                                       error:&error];
  NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
  
  [self.bridge.eventDispatcher sendAppEventWithName:@"BeaconsFound" body:jsonString];
}

@end
