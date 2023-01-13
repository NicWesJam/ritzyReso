from web3 import Web3
import json
import os


class Web3Query:
    """
    This class interacts with the Ethereum network through infura
    """

    def __init__(self, CONTRACT_ADDRESS, INFURA_URL):
        self.CONTRACT_ADDRESS = CONTRACT_ADDRESS
        self.INFURA_URL = INFURA_URL
        self.w3 = Web3(Web3.HTTPProvider(self.INFURA_URL))
      

        module_dir = os.path.dirname(__file__)  # get current directory
        file_path = os.path.join(module_dir, "contract.json")
        with open(file_path) as f:
            ABI = json.load(f)

        self.ABI = ABI

    def latest(self):
        print(self.w3.eth.get_block("latest"))

    def setup_contract(self):
        self.contract = self.w3.eth.contract(abi=self.ABI, address=self.CONTRACT_ADDRESS)

    def print_token_owners(self):
        print("Printing token and owner")
        print("token # - Owner")
        for i in range(self.contract.caller.getCount()):
            print(i, "-", self.contract.caller.ownerOf(i))

    def get_token_and_owners(self):
        # print('Printing token and owner')
        response_array = []
        for i in range(self.contract.caller.getCount()):
            response_array.append([i, self.contract.caller.ownerOf(i)])
        return response_array

    def get_owners(self):
        # print('Printing token and owner')
        response_array = []
        for i in range(self.contract.caller.getCount()):
            response_array.append(self.contract.caller.ownerOf(i).upper())
            # print(i, '-', self.contract.caller.ownerOf(i))
        
        return list(set(response_array))