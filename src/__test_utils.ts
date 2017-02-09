/**
 * spyOn
 * ...
 */
export const spyOn = ( ctx: any, method: string ): jest.Mock<any> => {
    const fn = jest.fn();
    ctx[ method ] = fn;
    return fn;
};
