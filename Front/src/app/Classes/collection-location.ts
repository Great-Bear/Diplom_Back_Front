import { Location } from "./location";



export class CollectionLocation {

    arrOblast = [
        'Одеська',
        'Дніпропетровська',
        'Чернігівська',
        'Харківська',
        'Житомирська',
        'Полтавська',
        'Херсонська',
        'Київська',
        'Запорізька',
        'Луганська',
        'Донецька',
        'Вінницька',
        'Автономна Республіка Крим',
        'Кiровоградська',
        'Миколаївськ',
        'Львівська',
        'Черкаська',
        'Хмельницька',
        'Волинська',
        'Рівненська',
        'Івано-Франківськ',
        'Тернопільська',
        'Закарпатська',
        'Чернівецька',
    ]

    public getDefautCollection(){
        let collection = new Array();
       
        
        for(let i = 0; i < 24; i++){
            let location =  new Location();
            location.Name = `${this.arrOblast[i]} Область `;
            location.Children = new Array();

            
        /*    for(let j = 0; j < 5; j++){
                let location2 = new Location();
                location2.Name = `Пункт ${j + 1}`;

                for(let q = 0; q < 3; q++){
                    let location3 = new Location()
                    location3.Name = `Подпункт ${q + 1}`;
                    location2.Children.push(location3);
                }
                location.Children.push(location2);
            }
            */
            collection.push(location);
        }

        let location2 = new Location();
        location2.Name = `Одеса`;
        
       
        let location3 = new Location()
        location3.Name = 'Київський';
        location2.Children.push(location3);

        let location4 = new Location()
        location4.Name = 'Малиновський';
        location2.Children.push(location4);

        let location5 = new Location()
        location5.Name = 'Приморський';
        location2.Children.push(location5);

        let location6 = new Location()
        location6.Name = 'Суворовський';
        location2.Children.push(location6);


        collection[0].Children.push(location2);

        let location7 = new Location();
        location7.Name = `Ізмаїл`;
        collection[0].Children.push(location7);

        let location8 = new Location();
        location8.Name = `Усатове`;
        collection[0].Children.push(location8);

        let location9 = new Location();
        location9.Name = `Дачне`;
        collection[0].Children.push(location9);


        return collection;
    }
}
