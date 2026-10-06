/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { KubeObject } from "../kube-object";

import type { ClusterScopedMetadata } from "../api-types";
import type { DeviceConfiguration, DeviceSelector } from "./resource-claim";

export type DeviceClassConfiguration = DeviceConfiguration;

export interface DeviceClassSpec {
  selectors?: DeviceSelector[];
  config?: DeviceClassConfiguration[];
  extendedResourceName?: string;
}

export class DeviceClass extends KubeObject<ClusterScopedMetadata, void, DeviceClassSpec> {
  static readonly kind = "DeviceClass";

  static readonly namespaced = false;

  static readonly apiBase = "/apis/resource.k8s.io/v1/deviceclasses";

  getSelectors(): DeviceSelector[] {
    return this.spec.selectors ?? [];
  }

  getConfig(): DeviceClassConfiguration[] {
    return this.spec.config ?? [];
  }

  getExtendedResourceName(): string | undefined {
    return this.spec.extendedResourceName;
  }
}
