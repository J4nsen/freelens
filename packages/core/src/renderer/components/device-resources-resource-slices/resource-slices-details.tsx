/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { observer } from "mobx-react";
import React from "react";
import { DrawerItem, DrawerTitle } from "../drawer";

import type { DeviceAttribute, NodeSelectorRequirement, ResourceSlice } from "@freelensapp/kube-object";

import type { KubeObjectDetailsProps } from "../kube-object-details";

export interface ResourceSliceDetailsProps extends KubeObjectDetailsProps<ResourceSlice> {}

const formatAttributeValue = (attribute: DeviceAttribute) => {
  if (attribute.string !== undefined) {
    return attribute.string;
  }

  if (attribute.int !== undefined) {
    return String(attribute.int);
  }

  if (attribute.bool !== undefined) {
    return String(attribute.bool);
  }

  if (attribute.version !== undefined) {
    return attribute.version;
  }

  return "";
};

const formatRequirement = (requirement: NodeSelectorRequirement) =>
  [requirement.key, requirement.operator, requirement.values ? `[${requirement.values.join(", ")}]` : undefined]
    .filter(Boolean)
    .join(" ");

@observer
export class ResourceSliceDetails extends React.Component<ResourceSliceDetailsProps> {
  render() {
    const { object: resourceSlice } = this.props;

    const { pool, nodeName, nodeSelector, allNodes, perDeviceNodeSelection } = resourceSlice.spec;
    const devices = resourceSlice.getDevices();

    return (
      <div className="ResourceSliceDetails">
        <DrawerItem name="Driver">{resourceSlice.getDriver()}</DrawerItem>

        {pool && (
          <>
            <DrawerItem name="Pool">{pool.name}</DrawerItem>
            <DrawerItem name="Pool Generation">{pool.generation}</DrawerItem>
            <DrawerItem name="Pool Resource Slice Count">{pool.resourceSliceCount}</DrawerItem>
          </>
        )}

        {nodeName && <DrawerItem name="Node Name">{nodeName}</DrawerItem>}
        {allNodes !== undefined && <DrawerItem name="All Nodes">{String(allNodes)}</DrawerItem>}
        {nodeSelector && (
          <DrawerItem name="Node Selector">
            {nodeSelector.nodeSelectorTerms?.map((term, index) => (
              <div key={index}>
                {term.matchExpressions?.map((requirement, requirementIndex) => (
                  <div key={`expression-${requirementIndex}`}>{formatRequirement(requirement)}</div>
                ))}
                {term.matchFields?.map((requirement, requirementIndex) => (
                  <div key={`field-${requirementIndex}`}>{formatRequirement(requirement)}</div>
                ))}
              </div>
            ))}
          </DrawerItem>
        )}
        {perDeviceNodeSelection !== undefined && (
          <DrawerItem name="Per Device Node Selection">{String(perDeviceNodeSelection)}</DrawerItem>
        )}

        {devices.length > 0 && (
          <>
            <DrawerTitle>Devices</DrawerTitle>
            {devices.map((device) => (
              <div key={device.name}>
                <DrawerItem name="Name">{device.name}</DrawerItem>
                {device.attributes && (
                  <DrawerItem name="Attributes">
                    {Object.entries(device.attributes).map(([name, attribute]) => (
                      <div key={name}>{`${name}: ${formatAttributeValue(attribute)}`}</div>
                    ))}
                  </DrawerItem>
                )}
                {device.capacity && (
                  <DrawerItem name="Capacity">
                    {Object.entries(device.capacity).map(([name, capacity]) => (
                      <div key={name}>{`${name}: ${capacity.value}`}</div>
                    ))}
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
