import json
import mymodule

def handler(event, context):
    print('request: {}'.format(json.dumps(event)))
    print(f" Output from layer: {mymodule.hello()}")
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'text/plain'
        },
        'body': 'Testing v2, CDK! You have hit {}\n'.format(event['path'])
    }
