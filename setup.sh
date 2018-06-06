#!/bin/sh

## This script automatically sets everything up for you
## to be run upon cloning the repo

# make everything runable
echo "marking scripts as runable..."
chmod +x *.sh


echo "setting up configuration directory..."
mkdir "$HOME/.corki"				# bot config directory

mkdir "$HOME/.corki/reddit"			# reddit stuff
touch "$HOME/.corki/reddit/clist"	# reddit channel forwarding

mkdir "$HOME/.corki/users"			# user directories
mkdir "$HOME/.corki/servers"		# server directories

mkdir "$HOME/.corki/lb"				# leaderboard



# if token wasn't exported by update.sh or steve.sh
# then we need to prompt the user for it
if [ ! -f $HOME/.corki/disc_key ]; then
	# get bot token
	printf "Enter your Discord token: "
	read DISCORD_TOKEN

    # put token into config dir
    printf "inserting token into ur ~/.corki/disc_key... "
    echo $DISCORD_TOKEN > $HOME/.corki/disc_key
    echo "done"
fi

if [ ! -f $HOME/.corki/riot_key ]; then
	# get token
	printf "Enter Riot API token: "
	read RIOT_TOKEN

	# put in file
	printf "inserting token into ~/.corki/riot_key... "
	echo $RIOT_TOKEN > $HOME/.corki/riot_key
	echo "done"
fi


if [ ! -f $HOME/.corki/champgg_key ]; then
	# get token
	printf "Enter champion.gg API token: "
	read CHAMPGG_TOKEN

	# put in file
	printf "inserting token into ~/.corki/champgg_key... "
	echo $CHAMPGG_TOKEN > $HOME/.corki/champgg_key
	echo "done"
fi


# install dependencies
echo "installing dependencies..."
npm install --save discord.js node-datetime open-exchange-rates money time lunicode-creepify lunicode-tiny lunicode-flip lunicode-mirror rss-parser teemojs request
echo "installed dependencies"