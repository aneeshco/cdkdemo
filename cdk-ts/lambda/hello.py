import json
import mymodule

def handler(event, context):
    print('request: {}'.format(json.dumps(event)))
    mymodule.hello()
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'text/plain'
        },
        'body': 'Testing hotswap, CDK! You have hit {}\n'.format(event['path'])
    }
