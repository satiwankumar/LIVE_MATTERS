
var date = new Date();

module.exports = {

    'WebAuthenticationDetail': {
        'UserCredential': {
            'Key': 'EEirdbr0mPJTOoaW', //Your Key given by FedEx
            'Password':'dPaK9RDJF4fPNAPw5PelCXaiU' //Your Password given by FedEx
        }
    },
    'ClientDetail': {
        AccountNumber: '510087160', //Your Account Number given by FedEx
        MeterNumber: '100702018'//Your Meter Number given by FedEx
    },
    'Version': {
        'ServiceId': 'crs',
        'Major': '20', 
        'Intermediate': '0',
        'Minor': '0'
    },
    'ReturnTransitAndCommit': true,
    'RequestedShipment': {
        'ShipTimestamp': new Date(date.getTime() + (24*60*60*1000)).toISOString(),
        'DropoffType': 'REGULAR_PICKUP',
        'ServiceType': 'STANDARD_OVERNIGHT',
        'PackagingType': 'YOUR_PACKAGING',
        'TotalWeight': {
            'Units': 'LB',
            'Value': "10"
        },
        'Shipper': {
            'Contact': {
                'CompanyName': 'Company Name',
                'PhoneNumber': '5555555555'
            },
            'Address': {
                'StreetLines': [
                'Address Line 1'
                ],
                'City': 'Los Angeles',
                'StateOrProvinceCode': 'CA',
                'PostalCode': '90001',
                'CountryCode': 'US'
            }
        },
        'Recipient': {
            'Contact': {
                'PersonName': 'Recipient Name',
                'PhoneNumber': '5555555555'
            },
            'Address': {
                'StreetLines': [
                'Address Line 1'
                ],
                'City': 'San Francisco',
                'StateOrProvinceCode': 'CA',
                'PostalCode': '90014',
                'CountryCode': 'US'
            }
        },
        'ShippingChargesPayment': {
            'PaymentType': 'SENDER',
            'Payor': {
                'ResponsibleParty': {
                    'AccountNumber': '510087160' //Your Account Number given by FedEx
                }
            }
        },
        'RateRequestTypes': 'LIST',
        'PackageCount': '1',
        'RequestedPackageLineItems': {
            'GroupPackageCount': 1,
            'Weight': {
                'Units': 'LB',
                'Value': "10"
            },
            'Dimensions': {
                'Length': "4",
                'Width': "6",
                'Height': "10",
                'Units': "IN"
            }
        }
    }

};