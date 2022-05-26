import { inputs2values } from '../adapters/modelCatalog2cwl';

test("renders user data", () => {
    const testParameters = [{
        "id": "1226b780-c685-11ec-9fbf-61bfe0b93dab",
        "name": "case",
        "displayName": "case",
        "description": "case",
        "type": "int",
        "unit": null,
        "unitDescription": null,
        "dataType": null,
        "choices": null,
        "min": null,
        "max": null,
        "modelId": null,
        "default": "1",
        "prefix": "--case",
        "componentId": "ab420e00-c67c-11ec-9fbf-61bfe0b93dab"
    }, {
        "id": "122753c0-c685-11ec-9fbf-61bfe0b93dab",
        "name": "conc",
        "displayName": "conc",
        "description": "conc",
        "type": "int",
        "unit": null,
        "unitDescription": null,
        "dataType": null,
        "choices": null,
        "min": null,
        "max": null,
        "modelId": null,
        "default": "121",
        "prefix": "--conc",
        "componentId": "ab420e00-c67c-11ec-9fbf-61bfe0b93dab"
    },
    {
        "id": "1227c8f0-c685-11ec-9fbf-61bfe0b93dab",
        "name": "degr",
        "displayName": "degr",
        "description": "degr",
        "type": "string",
        "unit": null,
        "unitDescription": null,
        "dataType": null,
        "choices": null,
        "min": null,
        "max": null,
        "modelId": null,
        "default": "121",
        "prefix": "--degr",
        "componentId": "ab420e00-c67c-11ec-9fbf-61bfe0b93dab"
    },
    {
        "id": "12290170-c685-11ec-9fbf-61bfe0b93dab",
        "name": "hydr",
        "displayName": "hydr",
        "description": "hydr",
        "type": "string",
        "unit": null,
        "unitDescription": null,
        "dataType": null,
        "choices": null,
        "min": null,
        "max": null,
        "modelId": null,
        "default": "121",
        "prefix": "--hydr",
        "componentId": "ab420e00-c67c-11ec-9fbf-61bfe0b93dab"
    },
    {
        "id": "12299db0-c685-11ec-9fbf-61bfe0b93dab",
        "name": "inic",
        "displayName": "inic",
        "description": "inic",
        "type": "string",
        "unit": null,
        "unitDescription": null,
        "dataType": null,
        "choices": null,
        "min": null,
        "max": null,
        "modelId": null,
        "default": "121",
        "prefix": "--inic",
        "componentId": "ab420e00-c67c-11ec-9fbf-61bfe0b93dab"
    },
    {
        "id": "122a12e0-c685-11ec-9fbf-61bfe0b93dab",
        "name": "rech",
        "displayName": "rech",
        "description": "rech",
        "type": "string",
        "unit": null,
        "unitDescription": null,
        "dataType": null,
        "choices": null,
        "min": null,
        "max": null,
        "modelId": null,
        "default": "121",
        "prefix": "--rech",
        "componentId": "ab420e00-c67c-11ec-9fbf-61bfe0b93dab"
    }
    ]
    const expected = {'case': 1, 'conc': 121, 'degr': '121', 'hydr': '121', 'inic': '121', 'rech': '121'}
    const actual = inputs2values(testParameters)
    expect(actual).toEqual(expected)
});