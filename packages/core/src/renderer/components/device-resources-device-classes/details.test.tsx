/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { DeviceClass } from "@freelensapp/kube-object";
import { beforeEach, describe, expect, it } from "vitest";
import { getDiForUnitTesting } from "../../getDiForUnitTesting";
import { renderFor } from "../test-utils/renderFor";
import { DeviceClassDetails } from "./device-classes-details";

import type { DeviceClassSpec, KubeJsonApiData, KubeObjectMetadata, KubeObjectScope } from "@freelensapp/kube-object";

import type { RenderResult } from "@testing-library/react";

import type { DiRender } from "../test-utils/renderFor";

const deviceClass: KubeJsonApiData<KubeObjectMetadata<KubeObjectScope.Cluster>, void, DeviceClassSpec> = {
  apiVersion: "resource.k8s.io/v1",
  kind: "DeviceClass",
  metadata: {
    name: "example-device-class",
    resourceVersion: "1",
    uid: "example-device-class",
    selfLink: "/apis/resource.k8s.io/v1/deviceclasses/example-device-class",
  },
  spec: {
    selectors: [
      {
        cel: {
          expression: 'device.driver == "gpu.example.com"',
        },
      },
    ],
    config: [
      {
        opaque: {
          driver: "gpu.example.com",
          parameters: {
            sharingStrategy: "TimeSlicing",
            replicas: 4,
          },
        },
      },
    ],
    extendedResourceName: "example.com/gpu",
  },
};

describe("DeviceClassDetails", () => {
  let result: RenderResult;
  let render: DiRender;

  beforeEach(() => {
    const di = getDiForUnitTesting();

    render = renderFor(di);
  });

  it("renders", () => {
    const object = new DeviceClass(deviceClass);

    result = render(<DeviceClassDetails object={object} />);

    expect(result.baseElement).toMatchSnapshot();
  });

  it("renders with an empty spec", () => {
    const object = new DeviceClass({
      ...deviceClass,
      spec: {},
    });

    result = render(<DeviceClassDetails object={object} />);

    expect(result.baseElement).toMatchSnapshot();
  });
});
