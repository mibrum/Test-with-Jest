import Model from './model'

test('New works', () => {
    expect(new Model).toBeInstanceOf(Model)
    // .toBeInstanceOf(Class) to check that an object is an instance of a class
})

test('Model estructure', () => {
    expect(new Model).toEqual(expect.objectContaining({
        $collection: expect.any(Array), // returns array
        record: expect.any(Function), // returns function
        all: expect.any(Function),
        find: expect.any(Function),
        update: expect.any(Function)
    }))
})

describe('record', () => {
    const heroes = [{ id: 1, name: 'Batman' }, { name: 'Black Panther' }]

    test('Can add data to the collection', () => {
        const model = new Model()
        model.record(heroes)
        expect(model.$collection).toEqual([heroes[0], {
            id: expect.any(Number),
            name: heroes[1].name
        }])
    })

    test('Gets called when data is passed to Model', () => {
        const spy = jest.spyOn(Model.prototype, 'record')
        const model = new Model(heroes)
        expect(spy).toHaveBeenCalled()
        expect(model.$collection).toEqual(heroes)
        spy.mockRestore() // Remove spy
    })
})

describe('all', () => {
    test('Returns empty model', () => {
        const model = new Model()
        expect(model.all()).toEqual([])
    })

    test('Returns model data', () => {
        const model = new Model([{ name: 'Supergirl' }, {name: 'Black Panther'}])
        expect(model.all().length).toBe(2)
    })

    test('Original data stays intact', () => {
        const model = new Model([{name: 'Batman'}])
        const data = model.all()
        data[0].name = 'Joker'

        expect(model.$collection[0].name).toBe('Batman')
    })
})

describe('find', () => {
    const heroes = [{ id: 1, name: 'Supergirl' }, { name: 'Black Panther' }]
    
    test('Returns null if nothing matches', () => {
        const model = new Model()
        expect(model.find(1)).toEqual(null)
    })

    test('Find returns a matching entry', () => {
        const model = new Model(heroes)
        expect(model.find(1)).toEqual(heroes[0])
    })
})

describe('update', () => {
    const heroesAndVillains = [{ id: 1, name: 'Batman' }]
    let model

    // This will create a new model before every test
    beforeEach(() => {
        const dataset = JSON.parse(JSON.stringify(heroesAndVillains))
        model = new Model(dataset)
    })

    test('An entry by ID', () => {
        model.update(1, {name: 'Joker'})
        expect(model.find(1).name).toBe('Joker')
    })

    test('Extend and entry by ID', () => {
        model.update(1, {cape: true})
        expect(model.find(1)).toEqual(expect.objectContaining({
            name: 'Batman',
            cape: true
        }))
    })

    test('Return false if no entry matches', () => {
        expect(model.update(2, {})).toBe(false)
    })

})