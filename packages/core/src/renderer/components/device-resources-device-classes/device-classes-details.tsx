/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { observer } from "mobx-react";
import React from "react";
import { DrawerItem, DrawerTitle } from "../drawer";

import type { DeviceClass } from "@freelensapp/kube-object";

import type { KubeObjectDetailsProps } from "../kube-object-details";

export interface DeviceClassDetailsProps extends KubeObjectDetailsProps<DeviceClass> {}

const formatParameterValue = (value: unknown) => (typeof value === "string" ? value : JSON.stringify(value));

@observer
export class DeviceClassDetails extends React.Component<DeviceClassDetailsProps> {
  render() {
    const { object: deviceClass } = this.props;

    const extendedResourceName = deviceClass.getExtendedResourceName();
    const selectors = deviceClass.getSelectors();
    const config = deviceClass.getConfig();

    return (
      <div className="DeviceClassDetails">
        {extendedResourceName && <DrawerItem name="Extended Resource Name">{extendedResourceName}</DrawerItem>}

        {selectors.length > 0 && (
          <>
            <DrawerTitle>Selectors</DrawerTitle>
            {selectors.map((selector, index) => (
              <div key={index}>
                {selector.cel && <DrawerItem name="Expression">{selector.cel.expression}</DrawerItem>}
              </div>
            ))}
          </>
        )}

        {config.length > 0 && (
          <>
            <DrawerTitle>Config</DrawerTitle>
            {config.map((entry, index) => (
              <div key={index}>
                {entry.opaque && (
                  <>
                    <DrawerItem name="Driver">{entry.opaque.driver}</DrawerItem>
                    <DrawerItem name="Parameters">
                      {Object.entries(entry.opaque.parameters ?? {}).map(([name, value]) => (
                        <div key={name}>{`${name}: ${formatParameterValue(value)}`}</div>
                      ))}
                    </DrawerItem>
                  </>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    );
  }
}
