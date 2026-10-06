/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import "./resource-claims.scss";

import { withInjectables } from "@ogre-tools/injectable-react";
import { observer } from "mobx-react";
import { KubeObjectAge } from "../kube-object/age";
import { KubeObjectListLayout } from "../kube-object-list-layout";
import { SiblingsInTabLayout } from "../layout/siblings-in-tab-layout";
import { NamespaceSelectBadge } from "../namespaces/namespace-select-badge";
import { WithTooltip } from "../with-tooltip";
import resourceClaimStoreInjectable from "./resource-claim-store.injectable";

import type { ResourceClaimStore } from "./resource-claim-store";

enum columnId {
  name = "name",
  namespace = "namespace",
  state = "state",
  age = "age",
}

interface Dependencies {
  store: ResourceClaimStore;
}

const NonInjectedResourceClaims = observer((props: Dependencies) => {
  return (
    <SiblingsInTabLayout>
      <KubeObjectListLayout
        isConfigurable
        tableId="device_resources_resource_claims"
        className="ResourceClaims"
        store={props.store}
        sortingCallbacks={{
          [columnId.name]: (claim) => claim.getName(),
          [columnId.namespace]: (claim) => claim.getNs(),
          [columnId.state]: (claim) => claim.getState(),
          [columnId.age]: (claim) => -claim.getCreationTimestamp(),
        }}
        searchFilters={[(claim) => claim.getSearchFields()]}
        renderHeaderTitle="Resource Claims"
        renderTableHeader={[
          { title: "Name", className: "name", sortBy: columnId.name, id: columnId.name },
          { title: "Namespace", className: "namespace", sortBy: columnId.namespace, id: columnId.namespace },
          { title: "State", className: "state", sortBy: columnId.state, id: columnId.state },
          { title: "Age", className: "age", sortBy: columnId.age, id: columnId.age },
        ]}
        renderTableContents={(claim) => [
          <WithTooltip>{claim.getName()}</WithTooltip>,
          <NamespaceSelectBadge key="namespace" namespace={claim.getNs()} />,
          <WithTooltip>{claim.getState()}</WithTooltip>,
          <KubeObjectAge key="age" object={claim} />,
        ]}
      />
    </SiblingsInTabLayout>
  );
});

export const ResourceClaims = withInjectables<Dependencies>(NonInjectedResourceClaims, {
  getProps: (di, props) => ({
    ...props,
    store: di.inject(resourceClaimStoreInjectable),
  }),
});
