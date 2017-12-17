import bunyan from 'bunyan'
import PostgresClient from '../libs/PostgresClient'
import config from '../config'

const postgres = new PostgresClient()
const log = bunyan.createLogger(config.logger.options)

export default async function Getlocations(req, res) {
  const info      = req.body
  const lat       = info.lat
  const lng       = info.lng
  const category  = info.category
  const distance  = 1e9

  /*
  // LEGACY PHP CODE
  $lat = $_POST['lat'];
  $lng = $_POST['lng'];
  $category = $_POST['category'];
  $distance = $_POST['distance'];

  $query = ''
  if(($lat != NULL) && ($lng != NULL)){
    $query .= "SELECT * , SQRT( POW( 69.1 * ( Latitude - ".$lat.") , 2 ) + POW( 69.1 * (".$lng." - Longitude ) * COS( Latitude / 57.3 ) , 2 ) ) AS Distance FROM Locations";

    if($category != NULL){
      $query .= " WHERE Category = '".$category."' HAVING Distance < ".$distance." ORDER BY Distance";
    }else{
      $query .= " HAVING Distance < ".$distance." ORDER BY Distance";
    }

  }else{
    $query .= "SELECT * FROM Locations";

    if($category != NULL){
      $query .= " WHERE Category = '".$category;
    }

  }
  */

  const { rows } = await postgres.query(`select * from locations`)
  res.json(rows)
}
