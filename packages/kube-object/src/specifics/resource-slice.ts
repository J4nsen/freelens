/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { KubeObject } from "../kube-object";

import type { ClusterScopedMetadata } from "../api-types";
import type { DeviceTaintEffect, NodeSelector } from "./resource-claim";

export interface ResourcePool {
  name: string;
  generation: number;
  resourceSliceCount: number;
}

export interface Counter {
  value: string;
}

export interface CounterSet {
  name: string;
  counters?: Record<string, Counter>;
}

export interface DeviceCounterConsumption {
  counterSet: string;
  counters?: Record<string, Counter>;
}

export interface CapacityRequestPolicyRange {
  min?: string;
  max?: string;
  step?: string;
}

export interface CapacityRequestPolicy {
  default?: string;
  validValues?: string[];
  validRange?: CapacityRequestPolicyRange;
}

export interface DeviceCapacity {
  value: string;
  requestPolicy?: CapacityRequestPolicy;
}

export interface DeviceAttribute {
  int?: number;
  bool?: boolean;
  string?: string;
  version?: string;
  ints?: number[];
  bools?: boolean[];
  strings?: string[];
  versions?: string[];
}

export interface DeviceTaint {
  key: string;
  value?: string;
  effect: DeviceTaintEffect;
  timeAdded?: string;
}

export interface NodeAllocatableResourceMapping {
  capacityKey?: string;
  allocationMultiplier?: string;
}

export interface Device {
  name: string;
  attributes?: Record<string, DeviceAttribute>;
  capacity?: Record<string, DeviceCapacity>;
  consumesCounters?: DeviceCounterConsumption[];
  nodeName?: string;
  nodeSelector?: NodeSelector;
  allNodes?: boolean;
  taints?: DeviceTaint[];
  bindsToNode?: boolean;
  bindingConditions?: string[];
  bindingFailureConditions?: string[];
  allowMultipleAllocations?: boolean;
  nodeAllocatableResourceMappings?: Record<string, NodeAllocatableResourceMapping>;
}

export interface ResourceSliceSpec {
  driver: string;
  pool: ResourcePool;
  nodeName?: string;
  nodeSelector?: NodeSelector;
  allNodes?: boolean;
  devices?: Device[];
  perDeviceNodeSelection?: boolean;
  sharedCounters?: CounterSet[];
}

export class ResourceSlice extends KubeObject<ClusterScopedMetadata, void, ResourceSliceSpec> {
  static readonly kind = "ResourceSlice";

  static readonly namespaced = false;

  static readonly apiBase = "/apis/resource.k8s.io/v1/resourceslices";

  getDriver(): string {
    return this.spec.driver;
  }

  getPoolName(): string {
    return this.spec.pool?.name ?? "";
  }

  getNodeName(): string | undefined {
    return this.spec.nodeName;
  }

  getDevices(): Device[] {
    return this.spec.devices ?? [];
  }
}
