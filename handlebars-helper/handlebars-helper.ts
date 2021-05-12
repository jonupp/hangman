function times(n : number, block) {
    let accum = "";
    for(let i = 0; i < n; ++i)
        accum += block.fn(i);
    return accum;
}

function ifeq(a, b, opts) {
    if (a === b) { // @ts-ignore
        return opts.fn(this);
    }
    else { // @ts-ignore
        return opts.inverse(this);
    }
}

export {times, ifeq};
