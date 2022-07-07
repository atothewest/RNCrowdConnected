package com.rncrowdconnected;

import android.util.Log;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import net.crowdconnected.android.core.Configuration;
import net.crowdconnected.android.core.ConfigurationBuilder;
import net.crowdconnected.android.core.CrowdConnected;
import net.crowdconnected.android.core.StatusCallback;
import net.crowdconnected.android.geo.GeoModule;
import net.crowdconnected.android.ips.IPSModule;

public class RNCrowdConnected extends ReactContextBaseJavaModule {
    RNCrowdConnected(ReactApplicationContext context) {
        super(context);
    }

    private void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    @Override
    public String getName() {
        return "RNCrowdConnected";
    }

    @ReactMethod
    public void restart() {
        CrowdConnected crowdConnected = CrowdConnected.getInstance();
        if (crowdConnected != null) {
            Log.i("CrowdConnect", "Restart");
            crowdConnected.restart();
        }
    }

    @ReactMethod
    public void startNavigation() {
        CrowdConnected crowdConnected = CrowdConnected.getInstance();
        if (crowdConnected != null) {
            Log.i("CrowdConnect", "Start navigation");
            crowdConnected.startNavigation();
        }
    }

    @ReactMethod
    public void stopNavigation() {
        CrowdConnected crowdConnected = CrowdConnected.getInstance();
        if (crowdConnected != null) {
            Log.i("CrowdConnect", "Stop navigation");
            crowdConnected.stopNavigation();
        }
    }

    @ReactMethod
    public void setAlias(String key, String value) {
        CrowdConnected crowdConnected = CrowdConnected.getInstance();
        if (crowdConnected != null) {
            Log.i("CrowdConnect", "Set alias key: " + key + " value: " + value);
            crowdConnected.setAlias(key, value);
        }
    }

    @ReactMethod
    public void start(String appKey, String appToken, String appSecret) {
        if (CrowdConnected.getInstance() == null) {
            Configuration configuration = new ConfigurationBuilder()
                    .withAppKey(appKey)
                    .withToken(appToken)
                    .withSecret(appSecret)
                    .withServiceNotificationInfo("RNCrowdConnected", android.R.drawable.btn_radio)
                    .withStatusCallback(new StatusCallback() {
                        @Override
                        public void onStartUpFailure(String reason) {
                          Log.i("CrowdConnect", "Start up failure: " + reason);
                        }

                        @Override
                        public void onStartUpSuccess() {
                            Log.i("CrowdConnect", "Start up success");
                            CrowdConnected crowdConnected = CrowdConnected.getInstance();
                            if (crowdConnected != null) {
                                sendEvent(getReactApplicationContext(), "onReady", null);

                                crowdConnected.registerPositionCallback(location -> {
                                    WritableMap updatedParams = Arguments.createMap();
                                    updatedParams.putString("latitude", String.valueOf(location.getLatitude()));
                                    updatedParams.putString("longitude", String.valueOf(location.getLongitude()));
                                    sendEvent(getReactApplicationContext(), "onLocationUpdated", updatedParams);
                                });
                            };
                        }
                    })
                    .addModule(new GeoModule())
                    .addModule(new IPSModule())
                    .build();

            CrowdConnected.start(getReactApplicationContext().getCurrentActivity().getApplication(), configuration);
        }
    }
}
