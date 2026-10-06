/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { ResourceClaim } from "@freelensapp/kube-object";
import { beforeEach, describe, expect, it } from "vitest";
import { getDiForUnitTesting } from "../../getDiForUnitTesting";
import { renderFor } from "../test-utils/renderFor";
import { ResourceClaimDetails } from "./resource-claims-details";

import type {
  KubeJsonApiData,
  KubeObjectMetadata,
  KubeObjectScope,
  ResourceClaimSpec,
  ResourceClaimStatus,
} from "@freelensapp/kube-object";

import type { RenderResult } from "@testing-library/react";

import type { DiRender } from "../test-utils/renderFor";

const resourceClaim: KubeJsonApiData<
  KubeObjectMetadata<KubeObjectScope.Namespace>,
  ResourceClaimStatus,
  ResourceClaimSpec
> = {
  apiVersion: "resource.k8s.io/v1",
  kind: "ResourceClaim",
  metadata: {
    name: "gpu-claim",
    namespace: "default",
    resourceVersion: "1",
    uid: "gpu-claim-uid",
    selfLink: "/apis/resource.k8s.io/v1/namespaces/default/resourceclaims/gpu-claim",
  },
  spec: {
    devices: {
      requests: [
        {
          name: "gpu",
          exactly: {
            deviceClassName: "gpu.example.com",
            allocationMode: "ExactCount",
            count: 2,
            adminAccess: false,
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
      constraints: [
        {
          requests: ["gpu"],
          matchAttribute: "gpu.example.com/family",
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
  status: {
    allocation: {
      allocationTimestamp: "2024-01-01T00:00:00Z",
      devices: {
        results: [
          {
            request: "gpu",
            driver: "gpu.example.com",
            pool: "worker-1",
            device: "gpu-0",
            shareID: "share-0",
          },
        ],
      },
    },
    reservedFor: [
      {
        resource: "pods",
        name: "gpu-pod",
        uid: "gpu-pod-uid",
      },
    ],
    devices: [
      {
        driver: "gpu.example.com",
        pool: "worker-1",
        device: "gpu-0",
        conditions: [
          {
            type: "Ready",
            status: "True",
          },
        ],
      },
    ],
  },
};

describe("ResourceClaimDetails", () => {
  let result: RenderResult;
  let render: DiRender;

  beforeEach(() => {
    const di = getDiForUnitTesting();

    render = renderFor(di);
  });

  it("renders", () => {
    const claim = new ResourceClaim(resourceClaim);

    result = render(<ResourceClaimDetails object={claim} />);

    expect(result.baseElement).toMatchSnapshot();
  });

  it("renders with no devices", () => {
    const claim = new ResourceClaim({
      ...resourceClaim,
      spec: {
        devices: {},
      },
      status: undefined,
    });

    result = render(<ResourceClaimDetails object={claim} />);

    expect(result.baseElement).toMatchSnapshot();
  });
});
