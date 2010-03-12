<?php
/**
 * 
 */

if ( !empty( $_POST['code'] ) )
{
	$filePath = 'cash/' . $_POST['code'] . '.json';
	if ( file_exists( $filePath ) && (time() - filemtime( $filePath )) <= ( 60 * 60) )
	{
		$data = file_get_contents( $filePath );
	}
	else
	{
		$url = 'http://xoap.weather.com/weather/local/' . $_POST['code'] . '?cc=*&dayf=5&link=xoap&prod=xoap&par=1173524804&key=aca9891354df4d5a&ut=c';
		$xmlstr = file_get_contents( $url );
		$xml = new SimpleXMLElement($xmlstr);
		//print_r($xml);
		
		$data['tmp']	= (int)$xml->cc->tmp;
		$data['t']		= (string)$xml->cc->t;
		$data['icon']	= (string)$xml->cc->icon;
		foreach ( $xml->dayf->day as $d )
		{
			$tmp['hi']	= (int)$d->hi;
			$tmp['low']	= (int)$d->low;
			/*$tmp['morning']['icon']	= (int)$d->part[0]->icon;
			$tmp['morning']['t']	= (string)$d->part[0]->t;
			$tmp['evening']['icon']	= (int)$d->part[1]->icon;
			$tmp['evening']['t']	= (string)$d->part[1]->t;*/
			$data['day'][] = $tmp;
		}
		$data = json_encode( $data );
		file_put_contents( $filePath, $data );
	}
	
	die( $data );
}