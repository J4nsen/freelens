/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import "./resource-claim-templates.scss";

import { withInjectables } from "@ogre-tools/injectable-react";
import { observer } from "mobx-react";
import { KubeObjectAge } from "../kube-object/age";
import { KubeObjectListLayout } from "../kube-object-list-layout";
import { SiblingsInTabLayout } from "../layout/siblings-in-tab-layout";
import { NamespaceSelectBadge } from "../namespaces/namespace-select-badge";
import { WithTooltip } from "../with-tooltip";
import resourceClaimTemplateStoreInjectable from "./resource-claim-template-store.injectable";

import type { ResourceClaimTemplateStore } from "./resource-claim-template-store";

enum columnId {
  name = "name",
  namespace = "namespace",
  age = "age",
}

interface Dependencies {
  store: ResourceClaimTemplateStore;
}

const NonInjectedResourceClaimTemplates = observer((props: Dependencies) => {
  return (
    <SiblingsInTabLayout>
      <KubeObjectListLayout
        isConfigurable
        tableId="device_resources_resource_claim_templates"
        className="ResourceClaimTemplates"
        store={props.store}
        sortingCallbacks={{
          [columnId.name]: (template) => template.getName(),
          [columnId.namespace]: (template) => template.getNs(),
          [columnId.age]: (template) => -template.getCreationTimestamp(),
        }}
        searchFilters={[(template) => template.getSearchFields()]}
        renderHeaderTitle="Resource Claim Templates"
        renderTableHeader={[
          { title: "Name", className: "name", sortBy: columnId.name, id: columnId.name },
          { title: "Namespace", className: "namespace", sortBy: columnId.namespace, id: columnId.namespace },
          { title: "Age", className: "age", sortBy: columnId.age, id: columnId.age },
        ]}
        renderTableContents={(template) => [
          <WithTooltip>{template.getName()}</WithTooltip>,
          <NamespaceSelectBadge key="namespace" namespace={template.getNs()} />,
          <KubeObjectAge key="age" object={template} />,
        ]}
      />
    </SiblingsInTabLayout>
  );
});

export const ResourceClaimTemplates = withInjectables<Dependencies>(NonInjectedResourceClaimTemplates, {
  getProps: (di, props) => ({
    ...props,
    store: di.inject(resourceClaimTemplateStoreInjectable),
  }),
});
