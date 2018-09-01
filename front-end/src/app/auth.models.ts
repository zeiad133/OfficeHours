export class LoginBody {
    email: string;
    password: string;
    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }
}

export class RegisterBody {
    email: string;
    password: string;
    confirmPassword: string;
    constructor(email: string, password: string, confirmPassword: string) {
        this.email = email;
        this.password = password;
        this.confirmPassword = confirmPassword;
    }
}

export class ResponseBody {
    err: string;
    msg: string;
    data: any;
    constructor(err: string, msg: string, data: any) {
        this.err = err;
        this.msg = msg;
        this.data = data;
    }
}
