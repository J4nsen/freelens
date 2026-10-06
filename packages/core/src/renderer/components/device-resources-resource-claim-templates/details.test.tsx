/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { ResourceClaimTemplate } from "@freelensapp/kube-object";
import { beforeEach, describe, expect, it } from "vitest";
import { getDiForUnitTesting } from "../../getDiForUnitTesting";
import { renderFor } from "../test-utils/renderFor";
import { ResourceClaimTemplateDetails } from "./resource-claim-templates-details";

import type {
  KubeJsonApiData,
  KubeObjectMetadata,
  KubeObjectScope,
  ResourceClaimTemplateSpec,
} from "@freelensapp/kube-object";

import type { RenderResult } from "@testing-library/react";

import type { DiRender } from "../test-utils/renderFor";

const resourceClaimTemplate: KubeJsonApiData<
  KubeObjectMetadata<KubeObjectScope.Namespace>,
  void,
  ResourceClaimTemplateSpec
> = {
  apiVersion: "resource.k8s.io/v1",
  kind: "ResourceClaimTemplate",
  metadata: {
    name: "gpu-claim-template",
    namespace: "default",
    resourceVersion: "1",
    uid: "gpu-claim-template-uid",
    selfLink: "/apis/resource.k8s.io/v1/namespaces/default/resourceclaimtemplates/gpu-claim-template",
  },
  spec: {
    metadata: {
      labels: {
        app: "gpu-workload",
      },
      annotations: {
        "example.com/owner": "platform",
      },
    },
    spec: {
      devices: {
        requests: [
          {
            name: "gpu",
            exactly: {
              deviceClassName: "gpu.example.com",
              allocationMode: "ExactCount",
              count: 1,
              selectors: [
                {
                  cel: {
                    expression: "device.attributes['gpu.example.com'].model == 'a100'",
                  },
                },
              ],
            },
          },
        ],
        config: [
          {
            requests: ["gpu"],
            opaque: {
              driver: "gpu.example.com",
              parameters: {
                sharing: "timeSlicing",
              },
            },
          },
        ],
      },
    },
  },
};

describe("ResourceClaimTemplateDetails", () => {
  let result: RenderResult;
  let render: DiRender;

  beforeEach(() => {
    const di = getDiForUnitTesting();

    render = renderFor(di);
  });

  it("renders", () => {
    const template = new ResourceClaimTemplate(resourceClaimTemplate);

    result = render(<ResourceClaimTemplateDetails object={template} />);

    expect(result.baseElement).toMatchSnapshot();
  });

  it("renders with no devices", () => {
    const template = new ResourceClaimTemplate({
      ...resourceClaimTemplate,
      spec: {
        spec: {
          devices: {},
        },
      },
    });

    result = render(<ResourceClaimTemplateDetails object={template} />);

    expect(result.baseElement).toMatchSnapshot();
  });
});
