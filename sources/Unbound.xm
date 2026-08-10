#import <jsi/jsi.h>

#import "Discord.h"
#import "JSI.h"
#import "RCTInstance.h"
#import "Utilities.h"

#include <atomic>

using namespace facebook;

#pragma mark - Embedded bootstrap

static __weak RCTInstance *gInstance = nil;
static std::atomic_bool gBootstrapScheduled{false};

static NSData *loadEmbeddedBootstrap(void)
{
    NSString *resPath = [[NSBundle mainBundle] resourcePath];
    NSString *path    = [resPath stringByAppendingPathComponent:@"Unbound/bootstrap.js"];
    if (![[NSFileManager defaultManager] fileExistsAtPath:path])
    {
        [Logger error:LOG_CATEGORY_DEFAULT
               format:@"Embedded Larp bootstrap not found at %@", path];
        return nil;
    }
    return [NSData dataWithContentsOfFile:path];
}

static void evaluateEmbeddedBootstrap(void)
{
    if (gBootstrapScheduled.exchange(true))
    {
        return;
    }

    dispatch_after(
        dispatch_time(DISPATCH_TIME_NOW, 4 * NSEC_PER_SEC),
        dispatch_get_global_queue(QOS_CLASS_USER_INITIATED, 0), ^{
            RCTInstance *instance = gInstance;
            if (!instance)
            {
                [Logger error:LOG_CATEGORY_DEFAULT
                       format:@"No RCTInstance captured; cannot evaluate Larp bootstrap."];
                return;
            }

            NSData *bootstrap = loadEmbeddedBootstrap();
            if (!bootstrap.length)
            {
                dispatch_async(dispatch_get_main_queue(), ^{
                    [Utilities alert:@"Larp bootstrap is missing from the app bundle."
                                title:@"Larp"];
                });
                return;
            }

            [instance callFunctionOnBufferedRuntimeExecutor:[bootstrap](jsi::Runtime &runtime) {
                [Logger info:LOG_CATEGORY_DEFAULT
                       format:@"Evaluating embedded Larp bootstrap..."];
                BOOL didLoad = [JSI evaluate:bootstrap tag:@"larp" runtime:runtime];
                [Logger info:LOG_CATEGORY_DEFAULT
                       format:@"Embedded Larp bootstrap evaluation %@.",
                              didLoad ? @"succeeded" : @"failed"];
            }];

            dispatch_after(
                dispatch_time(DISPATCH_TIME_NOW, 10 * NSEC_PER_SEC),
                dispatch_get_global_queue(QOS_CLASS_USER_INITIATED, 0), ^{
                    RCTInstance *diagInstance = gInstance;
                    if (!diagInstance) return;
                    [diagInstance callFunctionOnBufferedRuntimeExecutor:^(jsi::Runtime &runtime) {
                        try
                        {
                            auto global = runtime.global();
                            if (!global.hasProperty(runtime, "__larpDiag"))
                            {
                                return;
                            }
                            auto val = global.getProperty(runtime, "__larpDiag");
                            if (!val.isObject() || !val.getObject(runtime).isFunction(runtime))
                            {
                                return;
                            }
                            auto fn = val.getObject(runtime).getFunction(runtime);
                            auto res = fn.call(runtime);
                            if (res.isString())
                            {
                                std::string s = res.getString(runtime).utf8(runtime);
                                dispatch_async(dispatch_get_main_queue(), ^{
                                    [Utilities alert:[NSString stringWithUTF8String:s.c_str()]
                                                  title:@"Larp diag"];
                                });
                            }
                        }
                        catch (const std::exception &e)
                        {
                            [Logger error:LOG_CATEGORY_DEFAULT
                                   format:@"Larp diag read failed: %s", e.what()];
                        }
                    }];
                });
        });
}

#pragma mark - Hooks

%hook RCTInstance

- (void)_loadJSBundle:(NSURL *)sourceURL
{
    gInstance = self;
    %orig(sourceURL);
}

- (void)_loadScriptFromSource:(id)source
{
    %orig(source);
    evaluateEmbeddedBootstrap();
}

%end

%ctor
{
    if (![Utilities isRNNewArchEnabled])
    {
        dispatch_async(dispatch_get_main_queue(), ^{
            [Utilities alert:@"This version of Discord is incompatible with this version of the "
                             @"Tweak."];
        });
        return;
    }

    [Logger info:LOG_CATEGORY_DEFAULT format:@"Larp standalone tweak loaded."];
}
