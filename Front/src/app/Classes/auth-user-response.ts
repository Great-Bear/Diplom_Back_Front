export class AuthUserResponse {

    public id: string = "";
    public error : string = "";
    public role : string = "";


    constructor( obj?: Object ) {
        let data = JSON.parse( JSON.stringify(obj) );
        this.id = data.id;
        this.role = data.role;
        this.error = data.error
    }

}
