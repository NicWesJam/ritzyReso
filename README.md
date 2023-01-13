# Django + DRF + React SPA + Web3 + MetaMask + NFT

This project demonstrates a NFT Based platform built on Django featuring:
- Login with MetaMask and create a useraccount based on your ETH address
- NFT MetaData hosting in Django
- Django based NFT Fetch and display
- Cookie based authentication
- Django REST Framework
- Frontend and backend separated (same origin)
- Docker-compose set
- HTTPS through nginx (to make metamask happy)

Worked on this a little while ago and hope it is useful for those wanting to integrate web3 and django

## Getting Started
- Note this expects you are familiar with Django/DRF/Metamask/NFTs in general


Setup Contract
- Deploy an NFT contract, recommend you use the nft found in contracts folder
- https://remix.ethereum.org/ is an easy place to deploy your contract
- For the purpose of this getting started use Goerli test network
- Save contract address, mint an NFT to an accessible metamask account
- Update .env file with the relevant contract address
- If you used a different contract than the one provided cut and paste the ABI into ritzyreso/backend/nftmetadata/contract.json

Get OpenSea URL
- Go to https://testnets.opensea.io/ type in your contact address in search
- Copy down the url to your NFT on OpenSea
- Update .env file with relevant OpenSea URL

Setup Infura end point
- Setup infura and relevant endpoint, you will need to make an account
- Update .env file with relevant Infura URL for Goerli Ethereum Test net should look something like https://goerli.infura.io/v3/<youpublickey>

Setup HTTPS for NGINX
```
//navigate to ritzyreso/nginx/contracts
openssl req -x509 -sha256 -nodes -newkey rsa:2048 -days 365 -keyout localhost.key -out localhost.crt
```

Setup Django
```
docker-compose up -d --build
docker-compose exec backend python manage.py createsuperuser
```

Update NFT MetaData
- go to https://localhost/admin
- Login using your NFT metadata using the available NFTModel
- Ignore the user value as the system will check the relevant smart contract for the correct value

Navigate to https://localhost and you should be good to go

A few limitations:
- The NFT Metadata won't flow through to OpenSea unless you host on a public site which is beyond the scope of this repo
- Make sure to sign out of the the admin account before interacting with the site
- Not tested on mobile, just with MetaMask + Chrome

Credits:
- This project uses the great tutorial from https://testdriven.io/blog/django-spa-auth/ and code https://github.com/duplxey/django-spa-cookie-auth/tree/master/django_react_drf_same_origin as a basis to support the web3 integration