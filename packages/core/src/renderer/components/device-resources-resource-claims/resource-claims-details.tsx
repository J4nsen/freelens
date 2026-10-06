/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { observer } from "mobx-react";
import React from "react";
import { DrawerItem, DrawerTitle } from "../drawer";
import { LocaleDate } from "../locale-date";
import { ResourceClaimDeviceClaim } from "./resource-claim-device-claim";

import type { ResourceClaim } from "@freelensapp/kube-object";

import type { KubeObjectDetailsProps } from "../kube-object-details";

export interface ResourceClaimDetailsProps extends KubeObjectDetailsProps<ResourceClaim> {}

@observer
export class ResourceClaimDetails extends React.Component<ResourceClaimDetailsProps> {
  render() {
    const { object: resourceClaim } = this.props;

    const allocation = resourceClaim.getAllocation();
    const allocationResults = allocation?.devices?.results ?? [];
    const reservedFor = resourceClaim.getReservedFor();
    const deviceStatuses = resourceClaim.getAllocatedDeviceStatuses();

    return (
      <div className="ResourceClaimDetails">
        <DrawerItem name="State">{resourceClaim.getState()}</DrawerItem>

        <ResourceClaimDeviceClaim deviceClaim={resourceClaim.spec.devices ?? {}} />

        {allocation && (
          <>
            <DrawerTitle>Allocation</DrawerTitle>
            {allocation.allocationTimestamp && (
              <DrawerItem name="Allocated">
                <LocaleDate date={allocation.allocationTimestamp} />
              </DrawerItem>
            )}
            {allocationResults.map((result, index) => (
              <div key={index}>
                <DrawerItem name="Request">{result.request}</DrawerItem>
                <DrawerItem name="Driver">{result.driver}</DrawerItem>
                <DrawerItem name="Pool">{result.pool}</DrawerItem>
                <DrawerItem name="Device">{result.device}</DrawerItem>
                {result.shareID && <DrawerItem name="Share ID">{result.shareID}</DrawerItem>}
              </div>
            ))}
          </>
        )}

        {reservedFor.length > 0 && (
          <>
            <DrawerTitle>Reserved For</DrawerTitle>
            {reservedFor.map((consumer) => (
              <DrawerItem key={consumer.uid} name={consumer.resource}>
                {`${consumer.name} (${consumer.uid})`}
              </DrawerItem>
            ))}
          </>
        )}

        {deviceStatuses.length > 0 && (
          <>
            <DrawerTitle>Devices</DrawerTitle>
            {deviceStatuses.map((status, index) => (
              <div key={index}>
                <DrawerItem name="Driver">{status.driver}</DrawerItem>
                <DrawerItem name="Pool">{status.pool}</DrawerItem>
                <DrawerItem name="Device">{status.device}</DrawerItem>
                {status.shareID && <DrawerItem name="Share ID">{status.shareID}</DrawerItem>}
                {(status.conditions?.length ?? 0) > 0 && (
                  <DrawerItem name="Conditions">
                    {status.conditions?.map((condition) => `${condition.type}=${condition.status}`).join(", ")}
                  </DrawerItem>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    );
  }
}
