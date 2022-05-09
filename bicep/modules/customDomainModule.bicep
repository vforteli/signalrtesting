param CustomDomain string
param ServerFarmId string
param AppServiceName string
param Location string

resource customDomainCertificate 'Microsoft.Web/certificates@2021-02-01' = {
  name: CustomDomain
  location: Location
  properties: {
    canonicalName: CustomDomain
    serverFarmId: ServerFarmId
    domainValidationMethod: 'http-token'
  }
}

resource appService 'Microsoft.Web/sites@2021-02-01' existing = {
  name: AppServiceName
}

resource hostnameBinding 'Microsoft.Web/sites/hostNameBindings@2021-02-01' = {
  parent: appService
  name: CustomDomain
  properties: {
    sslState: 'SniEnabled'
    thumbprint: customDomainCertificate.properties.thumbprint
  }
}
