# Mining dashboard
                  
## Configuration

There are lots of things to configure, so follow these steps carefully.

1. Copy `setup/config.toml` to `~/.tari/{network}/config/config.toml` or wherever your global config file lives.
2. Edit `config.toml`. Find the word `REPLACE` and replace it with your own values.
3. Copy `setup/notifier.sh` to the path you specified in `config.toml`
4. Copy `setup/config.json` to the directory that contains `xmrig`. Edit the config file and set your own Monero 
   wallet address there.


## Run all the pieces 
In each terminal, set the following environment variables before running the binaries:

    TARI_NETWORK=nextnet

Then run each of these in a separate terminal. Take note of the extra command line arguments in some cases:

1. Tor (if not using libtor)
2. `minotari_node`
3. `minotari_console_wallet`
4. `minotari_merge_mining_proxy`
5. `./xmrig -c config.json --http-host 127.0.0.1 --http-port 3005`
6. `minotari_miner` 

Once everything is running, it should look something like this:

[video](https://drive.google.com/drive/u/2/folders/1ujDW-Gd-XMcVUFuV7X_v9_CEwOkTNOu9)

## Run the dashboard.

The dashboard consists of 2 pieces, a proxy server and a frontend.

### Proxy server

Start the proxy server by running:

    cd server
    npm install
    npm start

The server should now be running on `http://localhost:3000`.

### Frontend (development mode)

Start the frontend by running:

    cd frontend
    npm install
    npm start

The frontend should now be running on `http://localhost:3001`.

[video](https://drive.google.com/drive/u/2/folders/1ujDW-Gd-XMcVUFuV7X_v9_CEwOkTNOu9)

