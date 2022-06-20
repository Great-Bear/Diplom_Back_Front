import { Location } from "./location";

export class CollectionLocation {
    public getDefautCollection(){
        let collection = new Array();
       
        
        for(let i = 0; i < 24; i++){
            let location =  new Location();
            location.Name = `Область ${i + 1}`;

            for(let j = 0; j < 5; j++){
                let location2 = new Location();
                location2.Name = `Пункт ${j + 1}`;

                for(let q = 0; q < 3; q++){
                    let location3 = new Location()
                    location3.Name = `Подпункт ${q + 1}`;
                    location2.Children.push(location3);
                }
                location.Children.push(location2);
            }
            collection.push(location);
        }
        return collection;
    }
}
