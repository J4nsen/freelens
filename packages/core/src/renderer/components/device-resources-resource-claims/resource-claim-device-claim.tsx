/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { DrawerItem, DrawerTitle } from "../drawer";

import type { DeviceClaim, DeviceSelector } from "@freelensapp/kube-object";

export interface ResourceClaimDeviceClaimProps {
  deviceClaim: DeviceClaim;
}

interface DeviceSelectorsProps {
  selectors: DeviceSelector[] | undefined;
}

const DeviceSelectors = ({ selectors }: DeviceSelectorsProps) => {
  const expressions = (selectors ?? []).map((selector) => selector.cel?.expression).filter(Boolean);

  if (expressions.length === 0) {
    return null;
  }

  return (
    <DrawerItem name="Selectors">
      {expressions.map((expression, index) => (
        <div key={index}>{expression}</div>
      ))}
    </DrawerItem>
  );
};

export const ResourceClaimDeviceClaim = ({ deviceClaim }: ResourceClaimDeviceClaimProps) => {
  const requests = deviceClaim.requests ?? [];
  const constraints = deviceClaim.constraints ?? [];
  const config = deviceClaim.config ?? [];

  return (
    <>
      {requests.length > 0 && (
        <>
          <DrawerTitle>Device Requests</DrawerTitle>
          {requests.map((request) => (
            <div key={request.name}>
              <DrawerItem name="Name">{request.name}</DrawerItem>
              {request.exactly && (
                <>
                  <DrawerItem name="Device Class">{request.exactly.deviceClassName}</DrawerItem>
                  {request.exactly.allocationMode && (
                    <DrawerItem name="Allocation Mode">{request.exactly.allocationMode}</DrawerItem>
                  )}
                  {request.exactly.count !== undefined && <DrawerItem name="Count">{request.exactly.count}</DrawerItem>}
                  <DeviceSelectors selectors={request.exactly.selectors} />
                  {request.exactly.adminAccess !== undefined && (
                    <DrawerItem name="Admin Access">{String(request.exactly.adminAccess)}</DrawerItem>
                  )}
                </>
              )}
              {(request.firstAvailable ?? []).map((subRequest) => (
                <div key={subRequest.name}>
                  <DrawerItem name="Sub Request">{subRequest.name}</DrawerItem>
                  <DrawerItem name="Device Class">{subRequest.deviceClassName}</DrawerItem>
                  {subRequest.allocationMode && (
                    <DrawerItem name="Allocation Mode">{subRequest.allocationMode}</DrawerItem>
                  )}
                  {subRequest.count !== undefined && <DrawerItem name="Count">{subRequest.count}</DrawerItem>}
                  <DeviceSelectors selectors={subRequest.selectors} />
                </div>
              ))}
            </div>
          ))}
        </>
      )}

      {constraints.length > 0 && (
        <>
          <DrawerTitle>Constraints</DrawerTitle>
          {constraints.map((constraint, index) => (
            <div key={index}>
              {(constraint.requests?.length ?? 0) > 0 && (
                <DrawerItem name="Requests">{constraint.requests?.join(", ")}</DrawerItem>
              )}
              {constraint.matchAttribute && <DrawerItem name="Match Attribute">{constraint.matchAttribute}</DrawerItem>}
              {constraint.distinctAttribute && (
                <DrawerItem name="Distinct Attribute">{constraint.distinctAttribute}</DrawerItem>
              )}
            </div>
          ))}
        </>
      )}

      {config.length > 0 && (
        <>
          <DrawerTitle>Config</DrawerTitle>
          {config.map((item, index) => (
            <div key={index}>
              {(item.requests?.length ?? 0) > 0 && <DrawerItem name="Requests">{item.requests?.join(", ")}</DrawerItem>}
              {item.opaque && (
                <>
                  <DrawerItem name="Driver">{item.opaque.driver}</DrawerItem>
                  <DrawerItem name="Parameters">{JSON.stringify(item.opaque.parameters)}</DrawerItem>
                </>
              )}
            </div>
          ))}
        </>
      )}
    </>
  );
};
