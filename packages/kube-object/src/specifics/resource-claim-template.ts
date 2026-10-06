/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { KubeObject } from "../kube-object";

import type { KubeObjectScope, KubeTemplateObjectMetadata, NamespaceScopedMetadata } from "../api-types";
import type { ResourceClaimSpec } from "./resource-claim";

export interface ResourceClaimTemplateSpec {
  metadata?: KubeTemplateObjectMetadata<KubeObjectScope.Namespace>;
  spec: ResourceClaimSpec;
}

export class ResourceClaimTemplate extends KubeObject<NamespaceScopedMetadata, void, ResourceClaimTemplateSpec> {
  static readonly kind = "ResourceClaimTemplate";

  static readonly namespaced = true;

  static readonly apiBase = "/apis/resource.k8s.io/v1/resourceclaimtemplates";

  getClaimSpec(): ResourceClaimSpec {
    return this.spec.spec;
  }

  getTemplateLabels(): string[] {
    return KubeObject.stringifyLabels(this.spec.metadata?.labels);
  }
}
