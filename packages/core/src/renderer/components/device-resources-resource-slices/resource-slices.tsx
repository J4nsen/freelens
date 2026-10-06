/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import "./resource-slices.scss";

import { withInjectables } from "@ogre-tools/injectable-react";
import { observer } from "mobx-react";
import { KubeObjectAge } from "../kube-object/age";
import { KubeObjectListLayout } from "../kube-object-list-layout";
import { SiblingsInTabLayout } from "../layout/siblings-in-tab-layout";
import { WithTooltip } from "../with-tooltip";
import resourceSliceStoreInjectable from "./resource-slice-store.injectable";

import type { ResourceSliceStore } from "./resource-slice-store";

enum columnId {
  name = "name",
  driver = "driver",
  pool = "pool",
  node = "node",
  devices = "devices",
  age = "age",
}

interface Dependencies {
  store: ResourceSliceStore;
}

const NonInjectedResourceSlices = observer((props: Dependencies) => {
  return (
    <SiblingsInTabLayout>
      <KubeObjectListLayout
        isConfigurable
        tableId="device_resources_resource_slices"
        className="ResourceSlices"
        store={props.store}
        sortingCallbacks={{
          [columnId.name]: (item) => item.getName(),
          [columnId.driver]: (item) => item.getDriver(),
          [columnId.pool]: (item) => item.getPoolName(),
          [columnId.node]: (item) => item.getNodeName() ?? "",
          [columnId.age]: (item) => -item.getCreationTimestamp(),
        }}
        searchFilters={[(item) => item.getSearchFields(), (item) => item.getLabels()]}
        renderHeaderTitle="Resource Slices"
        renderTableHeader={[
          { title: "Name", className: "name", sortBy: columnId.name, id: columnId.name },
          { title: "Driver", className: "driver", sortBy: columnId.driver, id: columnId.driver },
          { title: "Pool", className: "pool", sortBy: columnId.pool, id: columnId.pool },
          { title: "Node", className: "node", sortBy: columnId.node, id: columnId.node },
          { title: "Devices", className: "devices", id: columnId.devices },
          { title: "Age", className: "age", sortBy: columnId.age, id: columnId.age },
        ]}
        renderTableContents={(item) => [
          <WithTooltip>{item.getName()}</WithTooltip>,
          <WithTooltip>{item.getDriver()}</WithTooltip>,
          <WithTooltip>{item.getPoolName()}</WithTooltip>,
          <WithTooltip>{item.getNodeName() ?? ""}</WithTooltip>,
          item.getDevices().length,
          <KubeObjectAge key="age" object={item} />,
        ]}
      />
    </SiblingsInTabLayout>
  );
});

export const ResourceSlices = withInjectables<Dependencies>(NonInjectedResourceSlices, {
  getProps: (di, props) => ({
    ...props,
    store: di.inject(resourceSliceStoreInjectable),
  }),
});
