import chai from 'chai';
import modelParser from '../src/lib/modelParser';
const assert = chai.assert;

describe('ModelParser', function () {
    it('Should work with datetimes', function () {
        let metadata = [{
            name: 'dateOfBirth',
            value: '12/08/1984',
            format: 'DD-MM-YYYY',
            type: 'datetime'
        }];
        let model = { dateOfBirth: '12-08-1984'};
        modelParser.parse(metadata, model);
        assert.ok(model.dateOfBirth instanceof Date);
    });
    it('Should work with entities', function () {
        let metadata = {
            name: 'phone',
            type: 'entity',
            fields: [
                {
                    name: 'number'
                },
                {
                    name: 'carrier',
                    type: 'entity',
                    entityName: 'carrier',
                    fields: [
                        {
                            name: 'code',
                            type: 'int'
                        },
                        {
                            name: 'date',
                            type: 'datetime',
                            format: 'DD/MM/YYYY'
                        }
                    ]
                }
            ]
        };
        let model = {
            phone: {
                number: '99168204',
                carrier: {
                    code: "51",
                    date: '12/08/1984'
                }
            }
        };
        modelParser.parse(metadata, model);
        assert.ok(model.phone.carrier.date instanceof Date);
    });

    it('Should work with arrays', function () {
        let metadata = {
            name: 'contacts',
            type: 'array',
            arrayType: 'entity',
            entityType: 'contact',
            fields: [
                {
                    name: 'name',
                    type: 'string'
                },
                {
                    name: 'phones',
                    type: 'array',
                    arrayType: 'entity',
                    entityType: 'phone',
                    fields: [
                        {
                            name: 'number',
                            type: 'string'
                        },
                        {
                            name: 'date',
                            type: 'datetime',
                            format: 'DD/MM/YYYY'
                        }
                    ]
                }
            ]
        };
        let model = {
            contacts: [{
                name: 'Andre',
                phones: [
                    {
                        number: '553299168204',
                        date: '01/01/2016'
                    },
                    {
                        number: '553299168205',
                        date: '01/02/2016'
                    }
                ]
            }]
        };
        modelParser.parse(metadata, model);
        assert.ok(model.contacts[0].phones[0].date instanceof Date);
        assert.ok(model.contacts[0].phones[1].date instanceof Date);
    });
});