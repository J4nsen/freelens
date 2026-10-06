/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { observer } from "mobx-react";
import React from "react";
import { ResourceClaimDeviceClaim } from "../device-resources-resource-claims/resource-claim-device-claim";
import { DrawerItemLabels, DrawerTitle } from "../drawer";

import type { ResourceClaimTemplate } from "@freelensapp/kube-object";

import type { KubeObjectDetailsProps } from "../kube-object-details";

export interface ResourceClaimTemplateDetailsProps extends KubeObjectDetailsProps<ResourceClaimTemplate> {}

@observer
export class ResourceClaimTemplateDetails extends React.Component<ResourceClaimTemplateDetailsProps> {
  render() {
    const { object: template } = this.props;

    const templateMetadata = template.spec.metadata;
    const hasTemplateMetadata = Boolean(
      Object.keys(templateMetadata?.labels ?? {}).length || Object.keys(templateMetadata?.annotations ?? {}).length,
    );

    return (
      <div className="ResourceClaimTemplateDetails">
        {hasTemplateMetadata && (
          <>
            <DrawerTitle>Template Metadata</DrawerTitle>
            <DrawerItemLabels name="Labels" labels={templateMetadata?.labels ?? {}} />
            <DrawerItemLabels name="Annotations" labels={templateMetadata?.annotations ?? {}} />
          </>
        )}

        <ResourceClaimDeviceClaim deviceClaim={template.spec.spec.devices ?? {}} />
      </div>
    );
  }
}
