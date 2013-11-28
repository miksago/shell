# shell

A browser based shell frontend. Orginally forked from [substack](https://github.com/substack)'s awesome tool [exterminate](https://github.com/substack/exterminate).

Written to provide [Alanna](https://github.com/AlannaR) with access to a shell / server through which she can continue learning Node.js and JavaScript.

## Usage

Requires the following environment variables:

```
  env COMMAND="/usr/bin/sudo -u [USER] -H -s /bin/bash"
```

Has the optional environment variables of:

```
  # Configuration for the HTTP server:
  env HOST="127.0.0.1"
  env PORT="3000"

  # enable basicAuth on the server:
  env AUTH_USER="my_user"
  env AUTH_PASS="my_pass"

  # specify the directory to start into:
  env CWD="/some/directory"
```

## Security

**Important: This module listens on HTTP, it will give access to a shell. Bad things can happen. ** 

## Disclaimer

```
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
