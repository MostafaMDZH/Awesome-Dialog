const Selector = require('./selector.js');

test('sample test', () => {
    const sb = new Selector({
        title: 'Pick a language...',
        options: [
            { name: 'English', id: 'en' },
            { name: 'French' , id: 'fr' },
            { name: 'Italic' , id: 'it' },
            { name: 'Spanish', id: 'es' },
        ]
    });
    expect(typeof sb).toEqual('object');
});