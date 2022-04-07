export class RegResp {

    public id: string = "";
    public success: boolean = false;
    public error : string = "";

    constructor( obj?: Object ) {
        let data = JSON.parse( JSON.stringify(obj) );

        this.id = data.id;
        this.success = data.success;
        this.error = data.error
    }

}
