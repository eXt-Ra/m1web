<?php
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: GET, POST');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

// -_-_-_-_-_Debut de la classe communicate-_-_-_-_-_ //
class Communicate{

	private $dbh;

	public function __construct(){
		$dataAxios = json_decode(file_get_contents("php://input"), true);
		$fnc = isset($dataAxios['fnc']) ? $dataAxios['fnc'] : null ;
		$this->dbh = new PDO('mysql:host=localhost;dbname=m1web', 'root', 'root', [
			PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
		]);

		switch($fnc){
			case 'AddLogement':
				$this->AddLogement();
			break;
		}

	}

	function getLogementByRegion($region) {
		$dbh = new PDO('mysql:host=localhost;dbname=m1web', 'root', 'root');
			$sql = "SELECT adresse_logement as adresse,cp_logement as cp, image_region, ST_asText(coords_logement) as coord FROM logement,region WHERE region.nom_region =:region and region.id_region = logement.fk_id_region";
			$query = $dbh->prepare($sql);
			$query->bindParam(':region', $region );
			$query->execute();

		$results = $query->fetchAll(PDO::FETCH_ASSOC);
		return $results;
	}

	public function AddLogement() {
		$dataAxios = json_decode(file_get_contents("php://input"), true);
		$data = extract($_POST);
		$image_region = $dataAxios['image_name'];
		$finfo = finfo_open(FILEINFO_MIME_TYPE);
		$finfoFile = finfo_file($finfo, $dataAxios['image_file']);

		$fileExtension;

		switch($finfoFile){
			case 'image/png':
			$fileExtension = 'png';
			break;

			case 'image/jpeg':
			$fileExtension = 'jpg';
			break;

			case 'image/gif':
			$fileExtension = 'gif';
			break;
		}
		$imageName = $this->generateRandomString() . '.' . $fileExtension;


		if (isset($dataAxios['image_file']))
		{
				// Testons si le fichier n'est pas trop gros
				if ($dataAxios['image_size'] <= 3000000)
				{
						// Testons si l'extension est autorisée
						$infosfichier = pathinfo($dataAxios['image_name']);
						$extension_upload = $fileExtension;
						$extensions_autorisees = array('jpg', 'jpeg', 'gif', 'png');
						if (in_array($extension_upload, $extensions_autorisees))
						{
								// On peut valider le fichier et le stocker définitivement
									// move_uploaded_file($imageName, 'uploads/' . $imageName);
									$this->base64_to_jpeg($dataAxios['image_file'],'uploads/'.$imageName);
								// echo "L'envoi a bien été effectué !";
						}else{
							die('L\'image n\'a pas la bonne extension');
						}
				}
		}
		$dbh = new PDO('mysql:host=localhost;dbname=m1web', 'root', 'root',[PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
		$sql = "INSERT INTO `logement` ( `adresse_logement`, `cp_logement`, `image_region`, `coords_logement`, `description_logement`, `fk_id_region`) VALUES ( :adresse_logement, :cp_logement, :image_region, GeomFromText(:coords_logement), :description_logement, :fk_id_region)";
				$query = $dbh->prepare($sql);
				$query->execute(['adresse_logement' => $dataAxios['adresse_logement'],
								'cp_logement' => $dataAxios['cp_logement'],
								'image_region' => $imageName,
								'coords_logement' => 'POINT('.$dataAxios['coords_logement']['lng'].' '.$dataAxios['coords_logement']['lat'].')',
								'description_logement'=> $dataAxios['description_logement'],
								'fk_id_region' => $this->getIdRegion($dataAxios['nom_region'])]);

	}

	private function getIdRegion($region) {
		$dbh = new PDO('mysql:host=localhost;dbname=m1web', 'root', 'root');
		$sql = "SELECT id_region FROM region WHERE nom_region = :region LIMIT 1";
		$query = $dbh->prepare($sql);
		$query->bindParam(':region', $region );
		$query->execute();
		$count = $query->rowCount();
		if ($count == 0) {
				$sqlb = "INSERT INTO `region` ( `nom_region`,`arrondissements_region`) VALUES ( :region, :arronregion)";
				$queryb = $dbh->prepare($sqlb);
				echo $region;
				$queryb->execute(['region' => $region , 'arronregion' => 68]);
				echo $dbh->lastInsertId();
				return $dbh->lastInsertId();
		}else {
				$results = $query->fetch();
				return $results['id_region'];
		}
	}
	private function generateRandomString(){
		return bin2hex(openssl_random_pseudo_bytes(16));
	}
	private function base64_to_jpeg($base64_string, $output_file) {
    // open the output file for writing
    $ifp = fopen( $output_file, 'wb' );
    // split the string on commas
    // $data[ 0 ] == "data:image/png;base64"
    // $data[ 1 ] == <actual base64 string>
    $data = explode( ',', $base64_string );
    // we could add validation here with ensuring count( $data ) > 1
    fwrite( $ifp, base64_decode( $data[1]) );
    // clean up the file resource
    fclose( $ifp );
		move_uploaded_file($output_file, 'uploads/' . $output_file);
    return $output_file;
}

	function BrutToJson($Tab){

		$toReturn = '{"array" : [';
		$Addresse="";$CP="";$Img="";$Coord="";$Desc="";$Reg="";
		foreach ($Tab as $key_Tab => $val_Tab){
			$toReturn .= '{';
			foreach ($val_Tab as $key => $val){
					if ($key == "adresse")$Addresse = $val;
					if ($key == 1)$CP = $val;
					if ($key == 2)$Img = $val;
					if ($key == 3)$Coord = $val;
					if ($key == 4)$Desc = $val;
			}
			$toReturn .= '"adresse" : "'.$Addresse.'", "cp" : '.$CP.', "coord" : {"lat" : '.substr($Coord,6,-10).', "lng" : '.substr($Coord,15,-1).'}, "desc" : "'.$Desc.'", "img" : "'.$Img.'"},';
		}
		$toReturn = substr($toReturn,0,-1);
		$toReturn .= ']}';
		return $toReturn;
	}

	function JsonToBrutWanted($Encoded,$Want){

		$decoded = json_decode($Encoded,true);
		$ToReturn = "Introuvable";
		foreach ($decoded as $key_Tab => $val_Tab){
			foreach ($val_Tab as $key_obj => $val_obj){
				foreach ($val_obj as $key => $val){
					if ($key == $Want && $Want != "Coord")
						$ToReturn = $val;
					if ($key == "Coord"){
						foreach ($val as $k =>$v){
							if ($k == $Want && $Want != "Coord")
							$ToReturn = $v;
						}
					}
				}
			}
		}
		return $ToReturn;
	}
}
// -_-_-_-_-_Fin de la classe communicate-_-_-_-_-_ //

	$com = new Communicate();

	//On appel la fonction SQL pour recuperer les données (on entre l'id de la region en paramètre)
	$result = $com->getLogementByRegion($_GET['region']);
	echo json_encode($result);


	// Function d'Add logement.
	//echo '<pre>'; print_r ($test->AddLogement(1,'8 rue Templar','94180','/img/Test',"POINT(37.724 22.554)",'test')); echo '</pre>';

	// A Faire : Update

	// die();
?>
