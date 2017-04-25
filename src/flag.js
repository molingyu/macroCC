let flag = { flags : new Map() };
flag.set = flag.flags.set.bind(flag.flags);

flag.set('$proc', 233);

export default flag;