/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { KubeObject } from "../kube-object";

import type { NamespaceScopedMetadata } from "../api-types";
import type { Condition } from "../types/condition";

export type DeviceAllocationMode = "ExactCount" | "All";

export type DeviceTolerationOperator = "Exists" | "Equal";

export type DeviceTaintEffect = "None" | "NoSchedule" | "NoExecute";

export type AllocationConfigSource = "FromClass" | "FromClaim";

export interface NodeSelectorRequirement {
  key: string;
  operator: string;
  values?: string[];
}

export interface NodeSelectorTerm {
  matchExpressions?: NodeSelectorRequirement[];
  matchFields?: NodeSelectorRequirement[];
}

export interface NodeSelector {
  nodeSelectorTerms: NodeSelectorTerm[];
}

export interface CELDeviceSelector {
  expression: string;
}

export interface DeviceSelector {
  cel?: CELDeviceSelector;
}

export interface CapacityRequirements {
  requests?: Record<string, string>;
}

export interface DeviceToleration {
  key?: string;
  operator?: DeviceTolerationOperator;
  value?: string;
  effect?: DeviceTaintEffect;
  tolerationSeconds?: number;
}

export interface ExactDeviceRequest {
  deviceClassName: string;
  selectors?: DeviceSelector[];
  allocationMode?: DeviceAllocationMode;
  count?: number;
  adminAccess?: boolean;
  tolerations?: DeviceToleration[];
  capacity?: CapacityRequirements;
}

export interface DeviceSubRequest {
  name: string;
  deviceClassName: string;
  selectors?: DeviceSelector[];
  allocationMode?: DeviceAllocationMode;
  count?: number;
  tolerations?: DeviceToleration[];
  capacity?: CapacityRequirements;
}

export interface DeviceRequest {
  name: string;
  exactly?: ExactDeviceRequest;
  firstAvailable?: DeviceSubRequest[];
}

export interface DeviceConstraint {
  requests?: string[];
  matchAttribute?: string;
  distinctAttribute?: string;
}

export interface OpaqueDeviceConfiguration {
  driver: string;
  parameters: Record<string, unknown>;
}

export interface DeviceConfiguration {
  opaque?: OpaqueDeviceConfiguration;
}

export interface DeviceClaimConfiguration extends DeviceConfiguration {
  requests?: string[];
}

export interface DeviceClaim {
  requests?: DeviceRequest[];
  constraints?: DeviceConstraint[];
  config?: DeviceClaimConfiguration[];
}

export interface ResourceClaimSpec {
  devices?: DeviceClaim;
}

export interface ResourceClaimConsumerReference {
  apiGroup?: string;
  resource: string;
  name: string;
  uid: string;
}

export interface DeviceRequestAllocationResult {
  request: string;
  driver: string;
  pool: string;
  device: string;
  adminAccess?: boolean;
  tolerations?: DeviceToleration[];
  bindingConditions?: string[];
  bindingFailureConditions?: string[];
  shareID?: string;
  consumedCapacity?: Record<string, string>;
}

export interface DeviceAllocationConfiguration extends DeviceConfiguration {
  source: AllocationConfigSource;
  requests?: string[];
}

export interface DeviceAllocationResult {
  results?: DeviceRequestAllocationResult[];
  config?: DeviceAllocationConfiguration[];
}

export interface AllocationResult {
  devices?: DeviceAllocationResult;
  nodeSelector?: NodeSelector;
  allocationTimestamp?: string;
}

export interface NetworkDeviceData {
  interfaceName?: string;
  ips?: string[];
  hardwareAddress?: string;
}

export interface AllocatedDeviceStatus {
  driver: string;
  pool: string;
  device: string;
  shareID?: string;
  conditions?: Condition[];
  data?: Record<string, unknown>;
  networkData?: NetworkDeviceData;
}

export interface ResourceClaimStatus {
  allocation?: AllocationResult;
  reservedFor?: ResourceClaimConsumerReference[];
  devices?: AllocatedDeviceStatus[];
}

export class ResourceClaim extends KubeObject<NamespaceScopedMetadata, ResourceClaimStatus, ResourceClaimSpec> {
  static readonly kind = "ResourceClaim";

  static readonly namespaced = true;

  static readonly apiBase = "/apis/resource.k8s.io/v1/resourceclaims";

  getDeviceRequests(): DeviceRequest[] {
    return this.spec.devices?.requests ?? [];
  }

  getAllocation(): AllocationResult | undefined {
    return this.status?.allocation;
  }

  getReservedFor(): ResourceClaimConsumerReference[] {
    return this.status?.reservedFor ?? [];
  }

  getAllocatedDeviceStatuses(): AllocatedDeviceStatus[] {
    return this.status?.devices ?? [];
  }

  getState(): string {
    if (!this.status?.allocation) {
      return "pending";
    }

    if (this.getReservedFor().length > 0) {
      return "allocated,reserved";
    }

    return "allocated";
  }
}
