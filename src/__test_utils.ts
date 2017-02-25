/**
 * SPIES
 * SPIES is a symbol field used to store spied method information.
 */
const SPIES = Symbol();

/**
 * spyOff
 * spyOff replaces a spied method with the original method.
 */
export const spyOff = ( ctx: any, method?: string ) => {
    if ( !method ) {
        Object.keys( ctx ).forEach( key => spyOff( ctx, key ));
        return;
    }
    if ( !ctx[ SPIES ] || !ctx[ SPIES ][ method ]) {
        return;
    }
    ctx[ method ] = ctx[ SPIES ][ method ].real;
};

/**
 * spyOn
 * spyOn replaces a method with a jest spy and returns the spy.
 */
export const spyOn = ( ctx: any, method: string, fake?: Function ): jest.Mock<any> => {
    if ( !ctx[ SPIES ]) {
        ctx[ SPIES ] = {};
    }
    if ( ctx[ SPIES ][ method ]) {
        return ctx[ SPIES ][ method ].spy;
    }
    const real = ctx[ method ];
    const spy = jest.fn( fake );
    ctx[ SPIES ][ method ] = { real, spy };
    ctx[ method ] = spy;
    return spy;
};
