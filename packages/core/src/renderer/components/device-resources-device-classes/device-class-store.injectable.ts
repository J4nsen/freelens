/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { deviceClassApiInjectable } from "@freelensapp/kube-api-specifics";
import { loggerInjectionToken } from "@freelensapp/logger";
import { getInjectable } from "@ogre-tools/injectable";
import { kubeObjectStoreInjectionToken } from "../../../common/k8s-api/api-manager/kube-object-store-token";
import clusterFrameContextForClusterScopedResourcesInjectable from "../../cluster-frame-context/for-cluster-scoped-resources.injectable";
import { DeviceClassStore } from "./device-class-store";

const deviceClassStoreInjectable = getInjectable({
  id: "device-class-store",
  instantiate: (di) => {
    const api = di.inject(deviceClassApiInjectable);

    return new DeviceClassStore(
      {
        context: di.inject(clusterFrameContextForClusterScopedResourcesInjectable),
        logger: di.inject(loggerInjectionToken),
      },
      api,
    );
  },
  injectionToken: kubeObjectStoreInjectionToken,
});

export default deviceClassStoreInjectable;
