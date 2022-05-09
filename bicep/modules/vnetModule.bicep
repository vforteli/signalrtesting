param AppName string
param Location string

resource vnet 'Microsoft.Network/virtualNetworks@2021-03-01' = {
  name: '${AppName}appvnet'
  location: Location
  properties: {
    addressSpace: {
      addressPrefixes: [
        '10.0.0.0/23'
      ]
    }
    subnets: [
      {
        name: 'appsubnet'
        properties: {
          addressPrefix: '10.0.0.0/24'
          delegations: [
            {
              name: 'delegation'
              properties: {
                serviceName: 'Microsoft.Web/serverFarms'
              }
            }
          ]
        }
      }
    ]
  }
}

output AppSubnetResourceId string = vnet.properties.subnets[0].id
