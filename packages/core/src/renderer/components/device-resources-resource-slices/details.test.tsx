/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { ResourceSlice } from "@freelensapp/kube-object";
import { beforeEach, describe, expect, it } from "vitest";
import { getDiForUnitTesting } from "../../getDiForUnitTesting";
import { renderFor } from "../test-utils/renderFor";
import { ResourceSliceDetails } from "./resource-slices-details";

import type { KubeJsonApiData, KubeObjectMetadata, KubeObjectScope, ResourceSliceSpec } from "@freelensapp/kube-object";

import type { RenderResult } from "@testing-library/react";

import type { DiRender } from "../test-utils/renderFor";

const resourceSlice: KubeJsonApiData<KubeObjectMetadata<KubeObjectScope.Cluster>, void, ResourceSliceSpec> = {
  apiVersion: "resource.k8s.io/v1",
  kind: "ResourceSlice",
  metadata: {
    name: "example-resource-slice",
    resourceVersion: "1",
    uid: "example-resource-slice",
    selfLink: "/apis/resource.k8s.io/v1/resourceslices/example-resource-slice",
  },
  spec: {
    driver: "gpu.example.com",
    pool: {
      name: "worker-1-gpu-pool",
      generation: 1,
      resourceSliceCount: 1,
    },
    nodeName: "worker-1",
    devices: [
      {
        name: "gpu-0",
        attributes: {
          model: { string: "A100" },
          memoryGiB: { int: 80 },
          healthy: { bool: true },
          driverVersion: { version: "1.2.3" },
        },
        capacity: {
          memory: { value: "80Gi" },
        },
      },
      {
        name: "gpu-1",
        attributes: {
          model: { string: "A100" },
        },
        capacity: {
          memory: { value: "80Gi" },
        },
      },
    ],
  },
};

describe("ResourceSliceDetails", () => {
  let result: RenderResult;
  let render: DiRender;

  beforeEach(() => {
    const di = getDiForUnitTesting();

    render = renderFor(di);
  });

  it("renders", () => {
    const object = new ResourceSlice(resourceSlice);

    result = render(<ResourceSliceDetails object={object} />);

    expect(result.baseElement).toMatchSnapshot();
  });

  it("renders without devices", () => {
    const object = new ResourceSlice({
      ...resourceSlice,
      spec: {
        driver: "gpu.example.com",
        pool: {
          name: "worker-1-gpu-pool",
          generation: 1,
          resourceSliceCount: 1,
        },
        allNodes: true,
      },
    });

    result = render(<ResourceSliceDetails object={object} />);

    expect(result.baseElement).toMatchSnapshot();
  });
});
